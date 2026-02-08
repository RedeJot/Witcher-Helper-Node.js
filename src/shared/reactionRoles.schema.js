import { z } from 'zod';

// Schemat konfiguracji Reaction Roles
export const ReactionRolesSchema = z.object({
  guildId: z.string().min(1, 'guildId jest wymagane.'),
  channelId: z.string().min(1, 'channelId jest wymagane.'),

  message: z.object({
    content: z.string().min(1, 'Treść wiadomości nie może być puste.'),
  }),

  buttons: z
    .array(
      z.object({
        label: z.string().min(1, 'Tekst przycisku wymagany.'),
        roleId: z.string().min(1, 'roleId wymagane.'),
        buttonType: z.enum(['primary', 'secondary', 'success', 'danger']),
        // emoji: z.string().optional(),
      }),
    )
    .min(1, 'Musi być conajmniej jeden przycisk.'),
});
