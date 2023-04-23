import { useEffect, useState } from "react";
import { Identity } from "@semaphore-protocol/identity";
import { SemaphoreEthers } from "@semaphore-protocol/data";
import { Event } from "@/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { events } from "@/__data";
import { EventDetail } from "@/components/EventDetail";
import { Layout } from "@/components/Layout";
import { generateGravatarUrl, truncateString } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import deploymentsJson from "../../../../contracts/deployments.json";
import { useDeployments } from "@/hooks/useDeployments";
import { useIsConnected } from "@/hooks/useIsConnected";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import VerifiedAnonymousJson from "../../../../contracts/build/contracts/contracts/VerifiedAnonymous.sol/VerifiedAnonymous.json";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
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

const semaphoreContract = deploymentsJson.localhost.semaphore;

const wasmFilePath = "../../../../contracts/build/snark-artifacts/semaphore.wasm";
const zkeyFilePath = "../../../../contracts/build/snark-artifacts/semaphore.zkey";

const EventDetailPage = ({ event }: EventDetailPageProps) => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useIsConnected();
  const { deployments } = useDeployments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: signer } = useSigner();

  const [modalMode, setModalMode] = useState<"createIdentity" | "joinGroup" | "sendReview">("createIdentity");
  const [identity, setIdentity] = useState<Identity>();

  const [tokenId, setTokenId] = useState("");
  const [review, setReview] = useState("");
  const [anonymousLevel, setAnonymousLevel] = useState(0);

  const semaphore = new SemaphoreEthers("http://localhost:8545", {
    address: semaphoreContract,
  });

  useEffect(() => {
    const identityString = localStorage.getItem("identity");
    if (identityString) {
      const _identity = new Identity(identityString);
      setIdentity(_identity);
      console.log("Your Semaphore identity was retrieved from the browser cache 👌🏽");
      setModalMode("joinGroup");
    } else {
      console.log("Create your Semaphore identity 👆🏽");
    }
  }, []);

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
          onClick={async () => {
            if (identity) {
              setModalMode("joinGroup");
              const members = await semaphore.getGroupMembers(event.id);
              setAnonymousLevel(members.length);
              const result = members.some((member) => member == identity.commitment.toString());
              if (result) {
                setModalMode("sendReview");
              }
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
              onChange={(e) => setTokenId(e.target.value)}
            />
            {!isConnected && (
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
                onClick={() => {
                  if (!openConnectModal) {
                    return;
                  }
                  openConnectModal();
                }}
              >
                Connect Wallet
              </button>
            )}
            {isConnected && deployments && signer && (
              <>
                <button
                  type="button"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
                  onClick={async () => {
                    const contract = new ethers.Contract(
                      deployments.verifiedAnonymous,
                      VerifiedAnonymousJson.abi,
                      signer
                    );
                    const tx = await contract.verifyAndJoinEvent(identity.commitment.toString(), tokenId);
                    console.log("verifyAndJoinEvent tx sent", tx.hash);
                    await tx.wait();
                    const members = await semaphore.getGroupMembers(event.id);
                    setAnonymousLevel(members.length);
                    setModalMode("sendReview");
                  }}
                >
                  Join
                </button>
              </>
            )}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Anonymous level:</label>
            <p className="mb-4 text-xs">{anonymousLevel}</p>
            <form className="w-full max-w-2xl mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave your verified & anonymous review:
              </label>
              <textarea
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
                rows={3}
                onChange={(e) => setReview(e.target.value)}
              />
              <div className="mt-4">
                {!isConnected && (
                  <button
                    type="button"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
                    onClick={() => {
                      if (!openConnectModal) {
                        return;
                      }
                      openConnectModal();
                    }}
                  >
                    Connect Wallet
                  </button>
                )}
                {isConnected && deployments && signer && (
                  <button
                    type="button"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
                    onClick={async () => {
                      const contract = new ethers.Contract(
                        deployments.verifiedAnonymous,
                        VerifiedAnonymousJson.abi,
                        signer
                      );

                      const members = await semaphore.getGroupMembers(event.id);
                      const group = new Group(event.id);
                      group.addMembers(members);

                      const fullProof = await generateProof(identity, group, event.id, review, {
                        wasmFilePath,
                        zkeyFilePath,
                      });

                      const tx = contract.sendReview(
                        event.id,
                        ethers.utils.formatBytes32String(review),
                        fullProof.merkleTreeRoot,
                        fullProof.nullifierHash,
                        fullProof.proof
                      );
                      console.log("sendReview sent", tx.hash);
                      await tx.wait();
                      setIsModalOpen(false);
                    }}
                  >
                    Send
                  </button>
                )}
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
