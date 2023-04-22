import { useState, useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity";

import { Event } from "@/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { events } from "@/__data";
import { EventDetail } from "@/components/EventDetail";
import { Layout } from "@/components/Layout";
import { generateGravatarUrl, truncateString } from "@/lib/utils";
import { Modal } from "@/components/Modal";

interface EventDetailPageProps {
  event: Event;
}

const reviews = [
  {
    text: "test review goes here",
  },
  {
    text: "demo review goes here",
  },
];

const EventDetailPage = ({ event }: EventDetailPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<"createIdentity" | "joinGroup" | "sendReview">("createIdentity");
  const [identity, setIdentity] = useState<Identity>();

  // const createIdentity = useCallback(async () => {
  //   const identity = new Identity();

  //   setIdentity(identity);

  //   localStorage.setItem("identity", identity.toString());

  //   setLogs("Your new Semaphore identity was just created 🎉");
  // }, []);

  return (
    <Layout>
      <div className="mb-8">
        <EventDetail {...event} />
      </div>
      <div className="w-full max-w-2xl px-4 mx-auto">
        <p className="block text-sm font-medium text-gray-700 mb-2">Verified Anonymous Reviews:</p>
        <div className="mb-8">
          {reviews.length === 0 && <p>No comments yet.</p>}
          {reviews.map(({ text }, i) => (
            <div key={i} className="border-t border-gray-200 pt-4 mt-4 flex">
              <img src={generateGravatarUrl(text)} alt={text} className="w-12 h-12 rounded-xl object-cover mr-4" />
              <div>
                <p className="text-left text-gray-800">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
          onClick={() => {
            // check semaphore identity
            let isIdentityCreated = false;
            const identityString = localStorage.getItem("identity");
            if (identityString) {
              const _identity = new Identity(identityString);
              setIdentity(_identity);
              console.log("Your Semaphore identity was retrieved from the browser cache 👌🏽");
              isIdentityCreated = true;
              setModalMode("joinGroup");
            } else {
              console.log("Create your Semaphore identity 👆🏽");
            }

            // check if the member joined the group
            let isJoinedGroup = false;
            if (isIdentityCreated) {
            }

            setIsModalOpen(true);
          }}
        >
          Send Review
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalMode("createIdentity");
          setIsModalOpen(false);
        }}
      >
        {modalMode === "createIdentity" && (
          <>
            <h2 className="text-lg font-medium mb-4">Create Anon Identity</h2>
            <button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
              onClick={() => {
                const _identity = new Identity();
                setIdentity(_identity);
                localStorage.setItem("identity", _identity.toString());
                console.log("Your new Semaphore identity was just created 🎉");
                setModalMode("joinGroup");
              }}
            >
              Create
            </button>
          </>
        )}
        {modalMode === "joinGroup" && identity && (
          <>
            <h2 className="text-2xl mb-4">Join Group with Verification</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your anon identity:</label>
            <div className="border border-gray-300 rounded-xl text-xs p-4 mb-4">
              <p className="mb-1">Tapdoor: {truncateString(identity.trapdoor.toString(), 16)}</p>
              <p className="mb-1">Nullifier: {truncateString(identity.nullifier.toString(), 16)}</p>
              <p className="mb-1">Commitment: {truncateString(identity.commitment.toString(), 16)}</p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">POAP verification:</label>
            <input
              type="text"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2 mb-4"
              placeholder="123790"
            />

            <button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
              onClick={() => {
                setModalMode("sendReview");
              }}
            >
              Join
            </button>
          </>
        )}
        {modalMode === "sendReview" && identity && (
          <>
            <h2 className="text-2xl mb-4">Send Review</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your anon identity:</label>
            <div className="border border-gray-300 rounded-xl text-xs p-4 mb-4">
              <p className="mb-1">Tapdoor: {truncateString(identity.trapdoor.toString(), 16)}</p>
              <p className="mb-1">Nullifier: {truncateString(identity.nullifier.toString(), 16)}</p>
              <p className="mb-1">Commitment: {truncateString(identity.commitment.toString(), 16)}</p>
            </div>
            <form className="w-full max-w-2xl mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave your verified & anonymous review:
              </label>
              <textarea
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
                rows={3}
              />
              <div className="mt-4">
                <button
                  type="button"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
                  onClick={() => {
                    // check semaphore identity
                    // check if the member joined the group
                    setIsModalOpen(false);
                  }}
                >
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
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
