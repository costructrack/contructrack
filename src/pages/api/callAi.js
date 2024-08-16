import { query } from '../../../lib/db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
      const { userPrompt } = req.query;

      if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
      try {
            // Get token extracts a encoded accessToken in the req, either from a cookie or from authorization.headers, then it decodes it and returns true if its valid
            const decoded = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
            if (!decoded) {
                  return res.status(401).json({ error: 'Invalid token' });
            }

            const payload = {
                  anthropic_version: "vertex-2023-10-16",
                  messages: [{ role: "user", content: userPrompt }],
                  max_tokens: 300,
                  stream: false,
            };

            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT, {
                  method: 'POST',
                  headers: {
                        'Authorization': `Bearer ${decoded}`,
                        'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
            });
            console.log(response)
            res.status(200).json(response);
      } catch (error) {
            res.status(500).json({ error: 'Error interno del servior' });
      }
}
