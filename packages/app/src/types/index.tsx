export interface Event {
  id: string;
  thumbnail: string;
  banner: string;
  title: string;
  shortDescription: string;
  longDescription: string;
}

export interface Deployments {
  semaphore: string;
  xpoap: string;
  verifiedAnonymous: string;
}

export type Network = "localhost" | "gnosis";

export type ChainId = 1337 | 100;

export const isChainId = (value: any): value is ChainId => {
  return value === 1337 || value === 100;
};
