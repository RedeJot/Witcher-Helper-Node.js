import express from 'express';
import { createRules } from '../controllers/rules.controller.js';

const router = express.Router();

router.post('/', createRules);

export default router;