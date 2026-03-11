import { NextResponse } from 'next/server';

const manifest = {
  name: 'Quirky Umbrella',
  short_name: 'Quirky',
  start_url: '/home',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#111111',
  icons: [],
};

export async function GET() {
  return NextResponse.json(manifest, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
