/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--color-border)', /* gray-700/12 */
        input: 'var(--color-input)', /* gray-700/12 */
        ring: 'var(--color-ring)', /* lime-pop */
        background: 'var(--color-background)', /* gray-50 */
        foreground: 'var(--color-foreground)', /* gray-900 */
        primary: {
          DEFAULT: 'var(--color-primary)', /* quirky-pink */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* trust-blue */
          foreground: 'var(--color-secondary-foreground)', /* white */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* lime-pop */
          foreground: 'var(--color-accent-foreground)', /* gray-900 */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-500 */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* green-500 */
          foreground: 'var(--color-success-foreground)', /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* amber-500 */
          foreground: 'var(--color-warning-foreground)', /* gray-900 */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-500 */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* gray-100 */
          foreground: 'var(--color-muted-foreground)', /* gray-600 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* white */
          foreground: 'var(--color-card-foreground)', /* gray-700 */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white */
          foreground: 'var(--color-popover-foreground)', /* gray-700 */
        },
        'text-primary': 'var(--color-text-primary)', /* gray-900 */
        'text-secondary': 'var(--color-text-secondary)', /* gray-600 */
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        'prose': '70ch',
      },
      ringWidth: {
        '3': '3px',
      },
      ringOffsetWidth: {
        '3': '3px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-10px) translateX(6px)' },
        },
        'drift-x': {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(18px)' },
        },
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
        'slide-down': 'slide-down 250ms ease-out',
        'scale-in': 'scale-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        float: 'float 6s ease-in-out infinite',
        'float-soft': 'float-soft 10s ease-in-out infinite',
        'drift-x': 'drift-x 14s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 10s ease-in-out infinite',
        shimmer: 'shimmer 2.25s linear infinite',
      },
    },
  },
  plugins: [],
}