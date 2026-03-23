import type { UserProfile } from "@/shared/types/user";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const userId = process.env.NEXT_PUBLIC_USER_ID;
const defaultUsername =
  process.env.NEXT_PUBLIC_DEFAULT_USERNAME ?? "default.user";
const defaultName =
  process.env.NEXT_PUBLIC_DEFAULT_NAME ?? "Default User";
const defaultEmail =
  process.env.NEXT_PUBLIC_DEFAULT_EMAIL ?? "default.user@example.com";
const defaultPhone =
  process.env.NEXT_PUBLIC_DEFAULT_PHONE ?? "+57 300 111 2233";

if (!apiUrl) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable.");
}

if (!userId) {
  throw new Error(
    "Missing NEXT_PUBLIC_USER_ID environment variable. Set a simulated test user in .env.local."
  );
}

export const env = {
  apiUrl,
  userId,
  defaultUser: {
    userId,
    username: defaultUsername,
    name: defaultName,
    email: defaultEmail,
    phone: defaultPhone,
    isDefault: true,
  } satisfies UserProfile,
};
