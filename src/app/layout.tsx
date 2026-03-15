import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadPulse — Catch the signal before your competitors do',
  description: 'AI-powered social intent intelligence. Discover high-intent leads from Reddit & X and convert them with AI-generated replies.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: '#030712',
          colorInputBackground: '#111827',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: '#9ca3af',
          colorPrimary: '#ffffff',
          colorNeutral: '#ffffff',
          borderRadius: '0.5rem',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
