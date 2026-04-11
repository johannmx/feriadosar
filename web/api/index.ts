import Fastify from 'fastify';
import axios from 'axios';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import NodeCache from 'node-cache';

// Set a default timeout of 10 seconds for all external API requests
axios.defaults.timeout = 10000;

const server = Fastify({
    logger: true,
    trustProxy: true
});

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3001;

// Cache configuration: 24 hours TTL for holidays as they rarely change
const holidayCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

// Security Middleware
server.register(helmet, {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'", "data:"],
            frameAncestors: ["'none'"],
            objectSrc: ["'none'"],
        },
    },
    referrerPolicy: { policy: 'no-referrer-when-downgrade' },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    xContentTypeOptions: true,
});

server.addHook('onRequest', async (request, reply) => {
    reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
});

// CORS Configuration
server.register(cors, {
    origin: true, // In production, this should be restricted to specific domains
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
});

// Rate Limiting
server.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes'
});

// Health check
server.get('/api/health', async () => {
    return { 
        status: 'ok', 
        timestamp: new Date().toISOString() 
    };
});

// Holidays Route
server.get<{ Params: { year: string } }>('/api/holidays/:year', async (request, reply) => {
    const { year } = request.params;
    
    // Validate year
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        return reply.status(400).send({ error: 'Invalid year parameter' });
    }

    // Check Cache first
    const cacheKey = `holidays_${year}`;
    const cachedData = holidayCache.get(cacheKey);
    if (cachedData) {
        return reply.send(cachedData);
    }

    try {
        const response = await axios.get(`https://api.argentinadatos.com/v1/feriados/${year}`);
        const data = response.data;

        // Store in cache
        holidayCache.set(cacheKey, data);

        return reply.send(data);
    } catch (error) {
        server.log.error('API Error:', error);
        return reply.status(500).send({ error: 'Failed to fetch holiday data' });
    }
});

// Start the server
const start = async () => {
    try {
        await server.listen({ port: PORT as number, host: '0.0.0.0' });
        console.log(`🚀 [API] Fastify Server running on port ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, async () => {
        try {
            await server.close();
            process.exit(0);
        } catch (err) {
            process.exit(1);
        }
    });
});
