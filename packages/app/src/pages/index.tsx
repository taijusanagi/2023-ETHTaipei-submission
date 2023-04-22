import { GetServerSideProps } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";

import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/__data";
import { Project } from "@/types";

const inter = Inter({ subsets: ["latin"] });

interface HomePageProps {
  projects: Project[];
}

const HomePage = ({ projects }: HomePageProps) => {
  return (
    <main className={`flex min-h-screen flex-col items-center p-8 ${inter.className}`}>
      <header className="w-full py-2 flex justify-between items-center">
        <Image className="h-8 w-auto" src="/next.svg" alt="Your Logo" width={180} height={37} priority />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">Connect Wallet</button>
      </header>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative my-24 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <div className="mb-32 grid text-center grid-cols-2 lg:mb-0 lg:grid-cols-4 lg:text-left">
        {projects.map((project) => {
          return <ProjectCard key={project.id} {...project} />;
        })}
      </div>
    </main>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      projects,
    },
  };
};
