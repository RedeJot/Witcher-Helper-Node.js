import { z } from 'zod';

export const RulesSchema = z.object({
  guildId: z.string().min(1, 'guildId jest wymagane.'),
  channelId: z.string().min(1, 'channelId jest wymagane.'),
  message: z.object({
    content: z.string().min(1, 'Treść wiadomości nie może być puste.'),
  }),
  buttonChecked: z.boolean(),
  button: z.object({
    roleId: z.string().optional().or(z.literal('')),
  }).optional(),
});