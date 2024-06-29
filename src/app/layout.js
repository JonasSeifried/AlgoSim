import { Inter } from 'next/font/google';
import './globals.css';
import SideNavBar from '@/components/SideNavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Algo Sim',
  description: 'Some algorithms visualized for fun',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + ' flex flex-row w-screen h-screen'}>
        <SideNavBar />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
