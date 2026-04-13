import Fastify from 'fastify';

const server = Fastify({
  logger: true
});

server.get('/api/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 API server running on port 3001');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
