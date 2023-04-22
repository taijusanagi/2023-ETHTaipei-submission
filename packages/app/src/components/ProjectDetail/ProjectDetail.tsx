import { Project } from "@/types";

type ProjectDetailProps = Pick<Project, "banner" | "title" | "shortDescription" | "longDescription">;

export const ProjectDetail = ({ banner, title, shortDescription, longDescription }: ProjectDetailProps) => {
  return (
    <div className="project-detail">
      <div className="banner w-full h-64 overflow-hidden">
        <img src={banner} alt="Banner" className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        <p className="mb-4 text-sm text-gray-600">{shortDescription}</p>
        <p className="text-base">{longDescription}</p>
      </div>
    </div>
  );
};
