import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';




const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.get('/', (req, res) => {
    logger.info('Hello from acquisitions-devops');
    res.status(200).send('Hello from acquisitions-devops');
});

export default app;
