import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const generateToken = payload => {
  return {
    sign: payload => {
      try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      } catch (e) {
        logger.error('Error generating the token', e);
        throw new Error('Error generating the token');
      }
    },
    verify: token => {
      try {
        return jwt.verify(token, JWT_SECRET);
      } catch (e) {
        logger.error('Error verifying the token', e);
        throw new Error('Error verifying the token');
      }
    },
  };
};
