import { Event } from "@/types";

type ProjectDetailProps = Pick<Event, "banner" | "title" | "shortDescription" | "longDescription">;

export const EventDetail = ({ banner, title, shortDescription, longDescription }: ProjectDetailProps) => {
  return (
    <div className="project-detail">
      <div className="banner w-screen h-64 overflow-hidden mb-4">
        <img src={banner} alt="Banner" className="w-full h-full object-cover" />
      </div>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        <p className="mb-4 text-sm text-gray-600">{shortDescription}</p>
        <p className="text-base">{longDescription}</p>
      </div>
    </div>
  );
};
