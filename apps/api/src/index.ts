import Fastify from 'fastify';
import cors from '@fastify/cors';
import { jobRoutes } from './routes/jobs';

const server = Fastify({
    logger: true
});

server.register(cors, {
    origin: '*' // In production, lock this down
});

server.register(jobRoutes, { prefix: '/v1/jobs' });

server.get('/health', async () => {
    return { status: 'ok' };
});

const start = async () => {
    try {
        await server.listen({ port: 3001, host: '0.0.0.0' });
        console.log('API listening on port 3001');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
