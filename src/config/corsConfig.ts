import cors from 'cors';

export const corsOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:4000',
  'https://localhost:4000',
  'https://suasplantas.com',
  'https://192.168.10.23:4000',
  'https://suasplantas.com.br',
  'https://www.suasplantas.com',
  'https://www.suasplantas.com.br',
  'https://suasplantas-git-stage-yowlisses.vercel.app',
];

export const corsConfig = cors(
  {
    exposedHeaders: 'Authorization',
    credentials: true,
    origin: corsOrigins,
  },
);
