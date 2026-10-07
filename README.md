# Vedic matchmaking in a Next.js app

Ashtakoot Guna Milan out of 36, with Rajju and Vedha checked as classical vetoes, from the [Asterwise API](https://asterwise.com) via its TypeScript SDK. One server action, one form, no client-side key.

Tutorial: [asterwise.com/blog/nextjs-vedic-matchmaking](https://asterwise.com/blog/nextjs-vedic-matchmaking/)

## Run it

```bash
git clone https://github.com/asterwise/nextjs-vedic-matchmaking
cd nextjs-vedic-matchmaking
npm install
cp .env.example .env.local   # paste a key from https://asterwise.com/dashboard (free: 500 calls a month)
npm run dev                  # http://localhost:3000
```

`npm run smoke` calls the same endpoint once from the command line and prints the score, the koota breakdown and whether the response carried Asterwise's signature header.

## How it works

- `src/lib/asterwise.ts` builds one SDK client from `ASTERWISE_API_KEY`. It is imported only by server code, so the key never ships to the browser.
- `src/app/actions.ts` is a server action. It reads the two people from the form, calls `matchmaking()` with `person1` (groom in the classical method) and `person2` (bride), and returns either the typed response or an error message.
- `src/app/page.tsx` renders the form with `useActionState`, then the score, the veto line, the eight kootas, and the narrative.

Birthplaces are geocoded by the API, so a city name is enough. Leave the time blank and the API uses a sunrise chart for that person and sets `birth_time_provided: false`; Moon-based kootas stay exact, ascendant-based checks become approximate.

## What the response contains

| Field | Meaning |
|---|---|
| `total_score` | Guna Milan points out of 36 |
| `breakdown` | Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi |
| `classical_vetoes` | `has_veto`, `rajju` (with `rajju_type`), `vedha`, `veto_note` |
| `doshas`, `dosha_cancellations` | Varna, Bhakoot and Nadi doshas and their cancellations |
| `mangal_compatibility` | Manglik status of each person and the match status |
| `supplementary_checks` | Mahendra and Stree Deergha |
| `compatibility_narrative` | `overall`, `strengths[]`, `concerns[]`, `recommendation` |

A veto is reported separately from the score on purpose: a 30/36 match with Rajju present is not a good match, and folding the veto into the points would hide that. Background: [Rajju and Vedha as hard vetoes](https://asterwise.com/blog/rajju-vedha-hard-vetoes/).

## Stack

Next.js 16 (App Router, server actions), React 19, the `asterwise` TypeScript SDK (generated from the API's OpenAPI document). MIT licensed.
