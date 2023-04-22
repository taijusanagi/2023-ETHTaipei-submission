import { GetServerSideProps } from "next";
import Image from "next/image";

import { EventCard } from "@/components/EventCard";
import { Layout } from "@/components/Layout";
import { Event } from "@/types";
import { events } from "@/__data";
import Link from "next/link";

interface HomePageProps {
  events: Event[];
}

const HomePage = ({ events }: HomePageProps) => {
  return (
    <Layout>
      <div className="my-12 relative flex flex-col items-center justify-center">
        <Image className="relative" src="/icon.png" alt="Next.js Logo" width={80} height={80} priority />
        <p className="mt-4 text-black text-xl font-bold text-center">Verified Anonymous</p>
      </div>
      <div className="grid text-center grid-cols-1 lg:grid-cols-4 lg:text-left gap-2">
        {events.map((event) => {
          return <EventCard key={event.id} {...event} />;
        })}
      </div>
      <div className="fixed bottom-0 right-0 p-4">
        <Link href="events/register">
          <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-full">
            Register Event
          </button>
        </Link>
      </div>
    </Layout>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      events,
    },
  };
};
