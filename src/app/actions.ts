"use server";

import { matchmaking } from "asterwise";
import type { MatchmakingResponse } from "asterwise";
import { asterwise } from "@/lib/asterwise";

export type Person = { name: string; date: string; time: string; location: string };
export type MatchResult =
  | { ok: true; data: MatchmakingResponse }
  | { ok: false; error: string };

function readPerson(form: FormData, prefix: string): Person {
  const get = (k: string) => String(form.get(`${prefix}_${k}`) ?? "").trim();
  return { name: get("name"), date: get("date"), time: get("time"), location: get("location") };
}

export async function runMatch(_prev: MatchResult | null, form: FormData): Promise<MatchResult> {
  const p1 = readPerson(form, "p1");
  const p2 = readPerson(form, "p2");
  for (const [label, p] of [["First person", p1], ["Second person", p2]] as const) {
    if (!p.date || !p.location) return { ok: false, error: `${label}: date and birthplace are required.` };
  }

  const res = await matchmaking({
    client: asterwise,
    body: {
      // person1 is the groom and person2 the bride in the classical Ashtakoot method.
      person1: { name: p1.name || undefined, date: p1.date, time: p1.time || null, location: p1.location },
      person2: { name: p2.name || undefined, date: p2.date, time: p2.time || null, location: p2.location },
    },
  });

  if (res.error || !res.data?.data) {
    const err = res.error as { message?: string; error?: string } | undefined;
    return { ok: false, error: err?.message ?? err?.error ?? `Request failed (${res.response.status}).` };
  }
  return { ok: true, data: res.data.data };
}
