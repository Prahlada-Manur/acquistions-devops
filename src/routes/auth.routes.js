import { register } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/register', register);

router.post('/login', (req, res) => {
  res.send('POST /api/auth/login');
});

router.post('/logout', (req, res) => {
  res.send('POST /api/auth/logout');
});

export default router;
