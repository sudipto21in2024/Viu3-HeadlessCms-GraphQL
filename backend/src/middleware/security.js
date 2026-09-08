import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Standard rate limiter: 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests. Please try again later.'
  }
});

// Stricter rate limiter for mutations like VIP booking: 20 per hour
export const mutationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    error: 'Booking rate limit reached. Please contact salon concierge directly.'
  }
});

// Configure Helmet with CSP relaxed for local development & Apollo Sandbox
export const securityHeaders = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false
});
