import { Event } from "@/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { events } from "@/__data";
import { EventDetail } from "@/components/EventDetail";
import { Layout } from "@/components/Layout";

interface EventDetailPageProps {
  event: Event;
}

const EventDetailPage = ({ event }: EventDetailPageProps) => {
  return (
    <Layout>
      <EventDetail {...event} />
    </Layout>
  );
};

export default EventDetailPage;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const eventId = context.params?.eventId;
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event,
    },
  };
};
