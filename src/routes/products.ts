import { Router } from 'express';
import { z } from 'zod';

const router = Router();

type Product = { id: string; name: string; price: number };

const db: Record<string, Product> = {
  '1': { id: '1', name: 'Keyboard', price: 49.99 },
  '2': { id: '2', name: 'Mouse', price: 19.99 },
  '3': { id: '3', name: 'Monitor', price: 149.99 }
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
  price: z.number().positive()
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
