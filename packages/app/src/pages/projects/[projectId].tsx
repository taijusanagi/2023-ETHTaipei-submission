import { Project } from "@/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { projects } from "@/__data";
import { ProjectDetail } from "@/components/ProjectDetail";
import { Layout } from "@/components/Layout";

interface ProjectDetailPageProps {
  project: Project;
}

const ProjectDetailPage = ({ project }: ProjectDetailPageProps) => {
  return (
    <Layout>
      <ProjectDetail {...project} />
    </Layout>
  );
};

export default ProjectDetailPage;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const projectId = context.params?.projectId;
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project,
    },
  };
};
