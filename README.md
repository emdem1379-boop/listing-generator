import crypto from 'crypto';
import { cookies } from 'next/headers';
import { requiredEnv } from '@/lib/env';

const COOKIE_NAME = 'listingkit_pro';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type ProCookiePayload = {
  pro: true;
  exp: number;
};

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

function sign(value: string) {
  return crypto
    .createHmac('sha256', requiredEnv('PRODUCT_UNLOCK_SECRET'))
    .update(value)
    .digest('base64url');
}

function encode(payload: ProCookiePayload) {
  const body = base64url(JSON.stringify(payload));
  const signature = sign(body);
  return `${body}.${signature}`;
}

function decode(token: string): ProCookiePayload | null {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  if (sign(body) !== signature) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as ProCookiePayload;
    if (!parsed.exp || Date.now() > parsed.exp) return null;
    if (parsed.pro !== true) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function isProUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return Boolean(decode(token));
}

export async function setProCookie() {
  const cookieStore = await cookies();
  const value = encode({ pro: true, exp: Date.now() + TTL_MS });
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: TTL_MS / 1000,
  });
}
