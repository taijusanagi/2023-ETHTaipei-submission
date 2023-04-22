import crypto from "crypto";

export const generateGravatarUrl = (userId: string) => {
  const hash = crypto.createHash("sha256").update(userId.toString()).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

export const truncateString = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};
