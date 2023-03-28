import { randomBytes } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import cookies from 'cookie';
import { env } from '../../../env.mjs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('✨ Getting CSRF token...');
  if (req.method === 'GET') {
    const token = randomBytes(28).toString('hex');
    res.setHeader(
      'Set-Cookie',
      cookies.serialize('csrf_token', token, {
        httpOnly: false, // important for reading cookie on the client
        maxAge: undefined, // expire with session
        sameSite: 'strict',
        path: '/',
        secure: env.NODE_ENV === 'production'
      })
    );
    res.status(200).json({ message: 'OK!' });
    res.end();
  } else {
    // Handle any other HTTP method
    return res.status(501);
  }
}
