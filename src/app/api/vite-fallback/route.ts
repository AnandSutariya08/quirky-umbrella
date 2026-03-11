import { NextResponse } from 'next/server';

const CLEANUP_AND_REDIRECT_MODULE = `
if (typeof window !== 'undefined') {
  const finish = () => {
    if (window.location.pathname !== '/home') {
      window.location.replace('/home');
    }
  };

  const clearCaches = async () => {
    if (!('caches' in window)) return;
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  };

  const unregisterServiceWorkers = async () => {
    if (!('serviceWorker' in navigator)) return;
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((reg) => reg.unregister()));
  };

  Promise.resolve()
    .then(unregisterServiceWorkers)
    .then(clearCaches)
    .catch(() => undefined)
    .finally(finish);
}

export {};
`;

export async function GET() {
  return new NextResponse(CLEANUP_AND_REDIRECT_MODULE, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
