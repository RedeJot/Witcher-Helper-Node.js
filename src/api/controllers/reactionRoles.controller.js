import { sendReactionRoleMessage } from '../../bot/services/buttonRoles.service.js';
import { ReactionRolesSchema } from '../../shared/reactionRoles.schema.js';

export async function createReactionRoles(req, res) {
  console.log('REQ BODY (RAW)', JSON.stringify(req.body, null, 2));
  try {
    // Walidacja schematu
    const config = ReactionRolesSchema.parse(req.body);
    // Jeśli walidacja przeszła, dane są dobre
    const result = await sendReactionRoleMessage(config);

    res.status(201).json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Reaction Roles Błąd:', error);
    if (error.name === 'ZodError') {
      console.error('❌ ZOD VALIDATION ERROR:');
      console.error(JSON.stringify(error.errors, null, 2));

      return res.status(400).json({
        error: 'Błąd walidacji',
        details: error.errors,
      });
    }

    console.error('❌ UNKNOWN ERROR:', error);
    return res.status(500).json({ error: 'Internal server error' });

    /* 
        // Błędy walidacji Zod
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Błąd Walidacji',
                details: error.errors,
            });
        }
        // Błąd serwera
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera' });
        */
  }
}
