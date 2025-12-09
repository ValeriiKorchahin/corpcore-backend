import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import './models/index.js';
import { errorMiddleWare } from './middlewares/errorMiddleware.js';
dotenv.config({ debug: true });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.use(errorMiddleWare);

app.listen(PORT, () => {
    console.log('Listening on port 8080');
});
