import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './config/db.js';
dotenv.config();

connectDB();
const port = process.env.PORT || 5000;
const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
import userRoute from './routes/userRoutes.js';

app.use('/api/v1/users', userRoute);

app.listen(port, () => console.log(`Server running on port ${port}`));
