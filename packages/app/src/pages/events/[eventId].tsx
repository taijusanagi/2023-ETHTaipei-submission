import { Event } from "@/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { events } from "@/__data";
import { EventDetail } from "@/components/EventDetail";
import { Layout } from "@/components/Layout";
import { generateGravatarUrl, truncateString } from "@/libs/utils";
interface EventDetailPageProps {
  event: Event;
}

const reviews = [
  {
    commitment: "8946221316445729782680741661566088377466430590831080913170667172101670104248",
    text: "review goes here",
  },
  {
    commitment: "4537343974081777732946793423584414608725321928124677597115032554753801717557",
    text: "review goes here",
  },
];

const EventDetailPage = ({ event }: EventDetailPageProps) => {
  return (
    <Layout>
      <div className="mb-8">
        <EventDetail {...event} />
      </div>
      <form className="w-full max-w-2xl px-4 mb-8 mx-auto">
        <label className="block text-sm font-medium text-gray-700 mb-2">Leave a review:</label>
        <textarea
          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
          rows={3}
        />
        <div className="mt-4">
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full"
          >
            Submit
          </button>
        </div>
      </form>
      <div className="w-full max-w-2xl px-4 mx-auto">
        <p className="block text-sm font-medium text-gray-700 mb-2">Verified Anonymous Reviews:</p>
        {reviews.length === 0 && <p>No comments yet.</p>}
        {reviews.map(({ commitment, text }, i) => (
          <div key={i} className="border-t border-gray-200 pt-4 mt-4 flex">
            <img
              src={generateGravatarUrl(commitment)}
              alt={commitment}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500">{truncateString(commitment, 8)}</p>
              </div>
              <p className="text-left text-gray-800">{text}</p>
            </div>
          </div>
        ))}
      </div>
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
