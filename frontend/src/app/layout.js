import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { Header } from '../components/layout/Header/Header';
import { BottomNavigation } from '../components/layout/BottomNavigation/BottomNavigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  metadataBase: new URL('https://weebster.com'),
  title: {
    default: 'Weebster | Premium Toy Store',
    template: '%s | Weebster',
  },
  description: 'Discover premium, exclusive toys at Weebster. Elevate your collection.',
  openGraph: {
    title: 'Weebster | Premium Toy Store',
    description: 'Discover premium, exclusive toys at Weebster.',
    url: 'https://weebster.com',
    siteName: 'Weebster',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({ children }) {
  // Global JSON-LD for Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Weebster",
    "url": "https://weebster.com",
    "logo": "https://weebster.com/logo.png"
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="main-content">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
        <BottomNavigation />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
