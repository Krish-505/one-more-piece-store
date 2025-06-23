// in app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Press_Start_2P } from 'next/font/google';
import Header from '@/components/Header';
import { CartProvider } from '@/lib/CartContext'; // Corrected import path

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const press_start = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start',
});

export const metadata: Metadata = {
  title: 'One More Piece',
  description: 'Vintage & Thrifted Clothing Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font variables to the body tag */}
      <body className={`${inter.variable} ${press_start.variable} flex flex-col min-h-screen bg-warm-beige`}>
        {/* The Provider wraps everything INSIDE the body */}
        <CartProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          {/* Footer can go here */}
        </CartProvider>
      </body>
    </html>
  );
}