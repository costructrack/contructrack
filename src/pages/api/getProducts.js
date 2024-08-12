import { query } from '../../../lib/db';

export default async function handler(req, res) {
      if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
      try {
            const result = await query('SELECT * FROM "Product"');
            res.status(200).json(result.rows);
      } catch (error) {
            res.status(500).json({ error: 'Error interno del servior' });
      }
}
