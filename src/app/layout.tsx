import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Next.js with Tailwind CSS',
  description: 'A boilerplate project with Next.js and Tailwind CSS',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFC] via-[#F7FAFC] to-[#FAFBFC]" />
          
          {/* Colorful gradient orbs */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(250,0,172,0.15)_0%,transparent_70%)] rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(39,78,255,0.12)_0%,transparent_70%)] rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(218,243,4,0.1)_0%,transparent_70%)] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(45,55,72,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,55,72,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          {/* Additional texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(45,55,72,0.02)_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>
        {children}
        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fquirkyumb2951back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.14" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}
