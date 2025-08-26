import { Router } from 'express';
import { z } from 'zod';

const router = Router();

type Product = { id: string; name: string; price: number; imageUrl: string };

const db: Record<string, Product> = {
  '1': { id: '1', name: 'Mechanical Keyboard', price: 69.99, imageUrl: '/assets/keyboard.png' },
  '2': { id: '2', name: 'Wireless Mouse',      price: 24.99, imageUrl: '/assets/mouse.png' },
  '3': { id: '3', name: '27” Monitor',          price: 189.00, imageUrl: '/assets/monitor.png' },
  '4': { id: '4', name: 'USB-C Hub',            price: 34.50, imageUrl: '/assets/hub.png' },      // add hub.png or remove this product
  '5': { id: '5', name: 'Noise-Cancel Headset', price: 99.00, imageUrl: '/assets/headset.png' }
};

router.get('/', (_req, res) => {
  res.json(Object.values(db));
});

router.get('/:id', (req, res) => {
  const p = db[req.params.id];
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  imageUrl: z.union([z.string().url(), z.string().startsWith('/assets/')]).optional()
    .default('/assets/keyboard.png')
});

router.post('/', (req, res) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const id = String(Object.keys(db).length + 1);
  const product: Product = { id, ...parsed.data };
  db[id] = product;
  res.status(201).json(product);
});

export default router;
