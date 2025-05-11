import express from 'express';
import cors from 'cors';
import "dotenv/config";

import authRoutes from './routes/authRoutes.js';
import postsRoutes from './routes/postsRoutes.js';

import {connectDB} from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});