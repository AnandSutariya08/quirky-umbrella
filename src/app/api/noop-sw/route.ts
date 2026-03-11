import { NextResponse } from 'next/server';

const NOOP_SERVICE_WORKER = `
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Intentionally no-op.
});
`;

export async function GET() {
  return new NextResponse(NOOP_SERVICE_WORKER, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
