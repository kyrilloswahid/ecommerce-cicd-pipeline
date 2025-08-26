import { Router } from 'express';
import { z } from 'zod';

const router = Router();

type CartItem = { productId: string; qty: number };
let cart: CartItem[] = [];

router.get('/', (_req, res) => {
  res.json({ items: cart, totalItems: cart.reduce((a, c) => a + c.qty, 0) });
});

const addItemSchema = z.object({
  productId: z.string(),
  qty: z.number().int().positive()
});

router.post('/add', (req, res) => {
  const parsed = addItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const existing = cart.find(i => i.productId === parsed.data.productId);
  if (existing) existing.qty += parsed.data.qty;
  else cart.push(parsed.data);
  res.status(201).json({ message: 'Added', items: cart });
});

router.post('/clear', (_req, res) => {
  cart = [];
  res.json({ message: 'Cleared' });
});

router.post('/checkout', (_req, res) => {
  res.json({ message: 'Checkout complete (simulated).' });
});


export default router;
