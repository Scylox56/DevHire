import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import connectDB from './config/db';
import { initSocket } from './socket';

import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import proposalRoutes from './routes/proposals';
import messageRoutes from './routes/messages';
import paymentRoutes from './routes/payments';
import reviewRoutes from './routes/reviews';
import devRoutes from './routes/devs';
import analyticsRoutes from './routes/analytics';

const app = express();
const server = createServer(app);

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/devs', devRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
