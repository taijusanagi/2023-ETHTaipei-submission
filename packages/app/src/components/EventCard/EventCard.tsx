import { Event } from "@/types";
import Link from "next/link";

type EventCardProps = Pick<Event, "thumbnail" | "id" | "title" | "shortDescription">;

export const EventCard = ({ thumbnail, id, title, shortDescription }: EventCardProps) => {
  return (
    <Link
      href={`/events/${id}`}
      className="group flex flex-col w-64 rounded-xl border border-transparent p-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 overflow-hidden"
    >
      <div className="w-full h-40 overflow-hidden">
        <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
      </div>
      <div className="mt-4">
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="m-0 text-sm">{shortDescription}</p>
      </div>
    </Link>
  );
};
