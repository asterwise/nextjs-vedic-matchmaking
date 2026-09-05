import { createClient, createConfig } from "asterwise/client";

// One client per server process. The key never reaches the browser: this
// module is only imported from server code (the server action in app/actions.ts).
const apiKey = process.env.ASTERWISE_API_KEY;
if (!apiKey) {
  throw new Error(
    "ASTERWISE_API_KEY is not set. Copy .env.example to .env.local and paste a key from https://asterwise.com/dashboard (free tier: 500 calls a month)."
  );
}

export const asterwise = createClient(
  createConfig({
    baseUrl: "https://api.asterwise.com",
    headers: { Authorization: `Bearer ${apiKey}` },
  })
);
