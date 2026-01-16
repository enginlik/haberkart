import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { renderTemplateToSvg } from '@news-card/renderer';
import { TemplateSchema } from '@news-card/schema';

const prisma = new PrismaClient();

const worker = new Worker('render-queue', async job => {
    const { jobId, input } = job.data;
    console.log(`Processing job ${jobId}...`);

    try {
        // 1. Update status to PROCESSING
        await prisma.job.update({
            where: { id: jobId },
            data: { status: 'PROCESSING' }
        });

        // 2. Fetch Template from DB
        const templateRecord = await prisma.template.findUnique({
            where: { id: input.templateId }
        });

        if (!templateRecord) {
            throw new Error(`Template ${input.templateId} not found`);
        }

        // 3. Parse Template Config (JSON)
        // We assume the DB json is valid, but good to check
        const templateConfig = TemplateSchema.parse(templateRecord.config);

        // 4. Render (Satori)
        // TODO: Load fonts properly. For now passing empty/mock.
        const svg = await renderTemplateToSvg(templateConfig, input.data, []);

        // 5. "Upload" (For local dev, we might just save to disk or mock URL)
        // In production: Upload SVG/PNG to MinIO here.
        const mockUrl = `https://minio.local/bucket/${jobId}.svg`;
        // NOTE: In real impl, use 'sharp' to convert SVG -> PNG/JPG if requested.

        // 6. Save Output & Complete
        await prisma.job.update({
            where: { id: jobId },
            data: {
                status: 'COMPLETED',
                result: { svgLength: svg.length }
            }
        });

        await prisma.jobOutput.create({
            data: {
                jobId: jobId,
                format: 'svg', // or other formats
                url: mockUrl,
                width: templateConfig.width,
                height: templateConfig.height
            }
        });

        console.log(`Job ${jobId} completed.`);
        return { success: true };

    } catch (err) {
        console.error(`Job ${jobId} failed:`, err);
        await prisma.job.update({
            where: { id: jobId },
            data: { status: 'FAILED' }
        });
        throw err;
    }
}, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    }
});

console.log('Worker started listening for jobs...');
