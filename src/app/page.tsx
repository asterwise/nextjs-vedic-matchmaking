"use client";

import { useActionState } from "react";
import { runMatch, type MatchResult } from "./actions";
import styles from "./page.module.css";

type Veto = { present?: boolean; description?: string; rajju_type?: string };
type Vetoes = { has_veto?: boolean; vedha?: Veto; rajju?: Veto; veto_note?: string };
type Narrative = {
  overall?: string;
  strengths?: string[];
  concerns?: { veto_type?: string; severity?: string; description?: string }[];
  recommendation?: string;
};

function PersonFields({ prefix, label, defaults }: { prefix: string; label: string; defaults: Record<string, string> }) {
  return (
    <fieldset className={styles.person}>
      <legend>{label}</legend>
      <label>Name <input name={`${prefix}_name`} defaultValue={defaults.name} /></label>
      <label>Date of birth <input name={`${prefix}_date`} type="date" required defaultValue={defaults.date} /></label>
      <label>Time of birth <input name={`${prefix}_time`} type="time" defaultValue={defaults.time} /></label>
      <label>Birthplace <input name={`${prefix}_location`} required placeholder="City, Country" defaultValue={defaults.location} /></label>
    </fieldset>
  );
}

export default function Home() {
  const [result, action, pending] = useActionState<MatchResult | null, FormData>(runMatch, null);

  return (
    <main className={styles.main}>
      <h1>Vedic matchmaking</h1>
      <p className={styles.lede}>
        Ashtakoot Guna Milan out of 36, with Rajju and Vedha checked as classical vetoes, from the
        Asterwise API. Birthplaces are geocoded server-side; leave the time blank for a sunrise chart.
      </p>

      <form action={action} className={styles.form}>
        <PersonFields prefix="p1" label="Person 1 (groom in the classical method)" defaults={{ name: "Arjun", date: "1990-05-14", time: "07:20", location: "Pune, India" }} />
        <PersonFields prefix="p2" label="Person 2 (bride in the classical method)" defaults={{ name: "Meera", date: "1992-11-03", time: "22:45", location: "Jaipur, India" }} />
        <button type="submit" disabled={pending}>{pending ? "Casting both charts…" : "Check compatibility"}</button>
      </form>

      {result && !result.ok && <p className={styles.error}>{result.error}</p>}

      {result?.ok && (() => {
        const d = result.data;
        const vetoes = (d.classical_vetoes ?? {}) as Vetoes;
        const narrative = (d.compatibility_narrative ?? {}) as Narrative;
        return (
          <section className={styles.result}>
            <div className={styles.score}>
              <span className={styles.big}>{d.total_score}</span>
              <span>/ 36 · {d.compatibility_level}</span>
            </div>

            {vetoes.has_veto ? (
              <p className={styles.veto}>
                Classical veto present. {vetoes.rajju?.present && `Rajju (${vetoes.rajju.rajju_type}). `}
                {vetoes.vedha?.present && "Vedha. "}
                {vetoes.veto_note}
              </p>
            ) : (
              <p className={styles.clear}>No Rajju or Vedha veto.</p>
            )}

            <table>
              <thead><tr><th>Koota</th><th>Score</th></tr></thead>
              <tbody>
                {Object.entries(d.breakdown).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td>{v}</td></tr>
                ))}
              </tbody>
            </table>

            {narrative.overall && <p>{narrative.overall}</p>}
            {narrative.strengths?.length ? (
              <>
                <h3>Strengths</h3>
                <ul>{narrative.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </>
            ) : null}
            {narrative.concerns?.length ? (
              <>
                <h3>Concerns</h3>
                <ul>{narrative.concerns.map((c, i) => <li key={i}>{c.description ?? c.veto_type}</li>)}</ul>
              </>
            ) : null}
            {narrative.recommendation && <p><strong>{narrative.recommendation}</strong></p>}
            {d.birth_time_provided === false && (
              <p className={styles.note}>A birth time was missing, so a sunrise chart was used for that person; Moon-based kootas are still exact, ascendant-based checks are approximate.</p>
            )}
            <details>
              <summary>Raw response</summary>
              <pre>{JSON.stringify(d, null, 2)}</pre>
            </details>
          </section>
        );
      })()}
    </main>
  );
}
