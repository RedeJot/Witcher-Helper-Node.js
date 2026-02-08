import express from 'express';
import {
  getGuildChannels,
  getGuildRoles,
} from '../controllers/guilds.controller.js';

const router = express.Router();

router.get('/:guildId/channels', getGuildChannels);
router.get('/:guildId/roles', getGuildRoles);

export default router;
