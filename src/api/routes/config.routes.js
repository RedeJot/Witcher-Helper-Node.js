import express from 'express';
import { env } from '../../config/env.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    guildId: env.guildID,
  });
});

export default router;
