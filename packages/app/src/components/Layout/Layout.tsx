import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <main className={`flex min-h-screen flex-col items-center ${inter.className}`}>
      <header className="w-full py-4 px-8 flex justify-between items-center">
        <Link href="/">
          <Image className="w-auto" src="/icon.png" alt="logo" width={32} height={32} priority />
        </Link>
        <ConnectButton />
      </header>
      <div className="">{children}</div>
      <footer className="h-8" />
    </main>
  );
};
