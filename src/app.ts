import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRouter from './routes/health';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';

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
