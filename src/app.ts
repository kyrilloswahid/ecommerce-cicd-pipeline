import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import cartRouter from './routes/cart';
import healthRouter from './routes/health';
import productsRouter from './routes/products';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// very simple frontend
app.use(express.static('public'));

app.use('/health', healthRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);

export default app;
