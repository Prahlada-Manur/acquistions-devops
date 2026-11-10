import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.body?.role || 'guest';
    let limit;
    let message;
    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin request exceeded please slow down';
        break;
      case 'user':
        limit = 10;
        message = 'User request exceeded please slow down';
        break;
      case 'guest':
        limit = 5;
        message = 'Guest request exceeded please slow down';
        break;
    }
    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );
    const decision = await client.protect(req);
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('BOT request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res
        .status(403)
        .json({ error: 'forbidden', message: 'BOT attack is blocked' });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('SHIELD request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res
        .status(403)
        .json({ error: 'forbidden', message: 'Shield has blocked you' });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limiter request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res
        .status(429)
        .json({ error: 'Too many requests', message: 'Too many request' });
    }
    next();
  } catch (error) {
    console.error('Arcjet middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default securityMiddleware;
