import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/NotFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parser
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ['http://localhost:4000', 'http://localhost:5173'],
        credentials: true,
    }),
);

app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
    // Promise.reject();
    res.send('Hello World!');
};

app.get('/', test);

app.use(globalErrorHandler);
app.use('*', notFound);

export default app;
