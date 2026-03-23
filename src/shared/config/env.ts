const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const userId = process.env.NEXT_PUBLIC_USER_ID;

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
};
