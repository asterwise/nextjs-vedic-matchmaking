// Calls the same endpoint the app uses, once, and prints the score.
// Usage: ASTERWISE_API_KEY=aw_... node scripts/smoke.mjs
import { createClient, createConfig } from "asterwise/client";
import { matchmaking } from "asterwise";

const key = process.env.ASTERWISE_API_KEY;
if (!key) { console.error("Set ASTERWISE_API_KEY"); process.exit(1); }
const client = createClient(createConfig({ baseUrl: "https://api.asterwise.com", headers: { Authorization: `Bearer ${key}` } }));
const res = await matchmaking({ client, body: {
  person1: { name: "Arjun", date: "1990-05-14", time: "07:20", location: "Pune, India" },
  person2: { name: "Meera", date: "1992-11-03", time: "22:45", location: "Jaipur, India" },
}});
if (res.error) { console.error("Request failed:", res.response?.status ?? "no response", JSON.stringify(res.error)); process.exit(1); }
const d = res.data.data;
console.log(`score ${d.total_score}/36 · ${d.compatibility_level} · veto: ${d.classical_vetoes?.has_veto ?? "n/a"}`);
console.log("breakdown", d.breakdown);
console.log("signature header present:", Boolean(res.response?.headers.get("x-asterwise-signature")));
