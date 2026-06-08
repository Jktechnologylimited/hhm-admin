import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "HHM Admin — Heaven's Hospitality Ministries",
  description: 'Ministry administration portal — JKTL V2 System',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
