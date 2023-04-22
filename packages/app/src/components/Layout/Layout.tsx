import Image from "next/image";
import Link from "next/link";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <main className={`flex min-h-screen flex-col items-center ${inter.className}`}>
      <header className="w-full p-8 flex justify-between items-center">
        <Link href="/">
          <Image className="h-8 w-auto" src="/next.svg" alt="Your Logo" width={180} height={37} priority />
        </Link>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">Connect Wallet</button>
      </header>
      {children}
    </main>
  );
};
