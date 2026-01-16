import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { JobInputSchema } from '@news-card/schema';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';

const prisma = new PrismaClient(); // In prod, make this a singleton/plugin
const renderQueue = new Queue('render-queue', {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    }
});

export async function jobRoutes(fastify: FastifyInstance) {

    // POST /v1/jobs - Create a new render job
    fastify.post('/', async (request, reply) => {
        // 1. Validate Input
        const parseResult = JobInputSchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.code(400).send(parseResult.error);
        }
        const input = parseResult.data;

        // 2. Mock Auth (TODO: Replace with real middleware)
        // Assuming a default workspace exists for now or creating one on the fly
        let workspace = await prisma.workspace.findFirst();
        if (!workspace) {
            workspace = await prisma.workspace.create({
                data: { name: 'Default', slug: 'default' }
            });
        }

        // 3. Create Job in DB
        const job = await prisma.job.create({
            data: {
                workspaceId: workspace.id,
                templateId: input.templateId,
                data: input.data,
                status: 'PENDING'
            }
        });

        // 4. Add to Redis Queue
        await renderQueue.add('render-job', {
            jobId: job.id,
            input: input
        });

        return reply.send({ jobId: job.id, status: 'PENDING' });
    });

    // GET /v1/jobs/:id - Get job status
    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        const job = await prisma.job.findUnique({
            where: { id },
            include: { outputs: true }
        });

        if (!job) {
            return reply.code(404).send({ error: 'Job not found' });
        }

        return job;
    });
}
