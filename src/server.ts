import path from 'path';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));


app.use(cors({
    // origin: 'http://'
}));

app.use(express.json());

app.use(routes);

app.use(errors());

app.listen(3333);