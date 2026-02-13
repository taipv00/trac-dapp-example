export const runtime = 'nodejs';

import { upstreamFetch } from '@/lib/upstream';

export async function GET() {
  const upstreamRes = await upstreamFetch('/contract/tx/context', { cache: 'no-store' });
  const body = await upstreamRes.text();
  const headers = new Headers();
  headers.set('Content-Type', upstreamRes.headers.get('content-type') || 'application/json; charset=utf-8');
  return new Response(body, { status: upstreamRes.status, headers });
}

