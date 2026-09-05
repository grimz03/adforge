import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Cataply — Launch your business further',
  description: 'Simple advertising for small businesses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
