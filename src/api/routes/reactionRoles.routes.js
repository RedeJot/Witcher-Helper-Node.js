import express from 'express';
import { createReactionRoles } from '../controllers/reactionRoles.controller.js';

const router = express.Router();

router.post('/', createReactionRoles);

export default router;
