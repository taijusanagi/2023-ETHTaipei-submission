import { Project } from "@/types";

type ProjectCardProps = Pick<Project, "thumbnail" | "id" | "title" | "shortDescription">;

export const ProjectCard = ({ thumbnail, id, title, shortDescription }: ProjectCardProps) => {
  return (
    <a
      href={`http://localhost:3000/projects/${id}`}
      className="group flex flex-col w-64 rounded-lg border border-transparent p-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 overflow-hidden"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="w-full h-40 overflow-hidden">
        <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
      </div>
      <div className="mt-4">
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="m-0 text-sm">{shortDescription}</p>
      </div>
    </a>
  );
};
