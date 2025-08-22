import { Router } from 'express';
import { z } from 'zod';

const router = Router();

type Product = { id: string; name: string; price: number; imageUrl: string };

const db: Record<string, Product> = {
  '1': { id: '1', name: 'Mechanical Keyboard', price: 69.99, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=60' },
  '2': { id: '2', name: 'Wireless Mouse', price: 24.99, imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155223168f?w=800&q=60' },
  '3': { id: '3', name: '27” Monitor', price: 189.00, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=60' },
  '4': { id: '4', name: 'USB‑C Hub', price: 34.50, imageUrl: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&q=60' },
  '5': { id: '5', name: 'Noise‑Cancel Headset', price: 99.00, imageUrl: 'https://images.unsplash.com/photo-1518441965245-04ee0f23d27f?w=800&q=60' }
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
  imageUrl: z.string().url().optional().default('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=60')
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
