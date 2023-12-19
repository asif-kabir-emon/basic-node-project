import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/NotFound';
import router from './app/routes';

const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
    // Promise.reject();
    res.send('Hello World!');
};

app.get('/', test);

app.use(globalErrorHandler);
app.use('*', notFound);

export default app;
