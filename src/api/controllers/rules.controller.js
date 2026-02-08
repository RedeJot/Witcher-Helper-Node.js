import { sendRulesMessage } from '../../bot/services/rules.service.js';
import { RulesSchema } from '../../shared/rules.schema.js';

export async function createRules(req, res) {
  console.log('REQ BODY (RAW)', JSON.stringify(req.body, null, 2));
  try {
    // Walidacja schematu
    const config = RulesSchema.parse(req.body);
    // Jeśli walidacja przeszła, dane są dobre
    const result = await sendRulesMessage(config);

    res.status(201).json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Rules Błąd:', error);
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
    }
}