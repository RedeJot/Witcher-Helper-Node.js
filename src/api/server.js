import express from 'express';
import cors from 'cors';
import guildsRoutes from './routes/guilds.routes.js';
import reactionRolesRoutes from './routes/reactionRoles.routes.js';
import rules from './routes/rules.routes.js';
import configRoutes from './routes/config.routes.js';

export const startApi = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Cors wymagany dla przeglądarki
  app.use(
    cors({
      origin: 'http://localhost:5173',
    }),
  );

  // Wczytanie GUILD_ID z serwera
  app.use('/api/config', configRoutes);

  app.use(express.json());

  // Wczytanie listy ról
  app.use('/api/reaction-roles', reactionRolesRoutes);

  app.use('/api/rules', rules);

  // Wczytanie listy kanałów
  app.use('/api/guilds', guildsRoutes);

  app.get('/', (req, res) => {
    res.send('API działa poprawnie!');
  });

  app.listen(port, () => {
    console.log(`Backend działa na porcie: ${port}`);
  });
};
