import express from 'express';
import cors from 'cors';
import http from 'node:http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { initDatabase, db } from './db/database.js';
import { seedData } from './db/seed.js';
import { securityHeaders, apiLimiter } from './middleware/security.js';

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Initialize DB & Seed if empty
  initDatabase();
  const count = db.prepare('SELECT COUNT(*) as cnt FROM collections').get();
  if (!count || count.cnt === 0) {
    seedData();
  }

  // Apollo Server initialization
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError) => {
      console.error('GraphQL Error:', formattedError.message);
      return {
        message: formattedError.message,
        path: formattedError.path
      };
    }
  });

  await server.start();

  // Middleware pipeline
  app.use(securityHeaders);
  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }));
  app.use(express.json());
  app.use('/graphql', apiLimiter);

  // GraphQL Endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.authorization || '',
        ip: req.ip
      })
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'Maison Aura Headless CMS (GraphQL API)',
      timestamp: new Date().toISOString()
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`✦ Maison Aura Headless CMS GraphQL Server running at http://localhost:${PORT}/graphql`);
    console.log(`✦ Health check available at http://localhost:${PORT}/health`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
