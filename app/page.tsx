import Image from "next/image";
import PlanReview from "@/components/PlanReview";
import {
  AGENT_NAME,
  ISSUE_NUMBER,
  ISSUE_TITLE,
  ESTIMATE_LINE,
  READING,
  BOUNDARY,
} from "@/data/plan";

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="w-full border-b border-ziki-border bg-ziki-surface">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-4 overflow-x-auto">
        {/* Logo */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Image
            src="/ziki-mark.svg"
            alt="Ziki logo mark"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-ziki-text font-bold text-sm tracking-tight">ziki</span>
        </div>

        {/* Workspace */}
        <span className="text-ziki-text text-sm font-medium flex-shrink-0">Zedu</span>

        {/* Nav links */}
        <nav aria-label="Main navigation" className="flex items-center gap-4 ml-2">
          {["Product", "Marketing", "Security", "Agents"].map((label) => (
            <span
              key={label}
              className="text-ziki-muted text-xs hover:text-ziki-text flex-shrink-0 cursor-default"
            >
              {label}
            </span>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          {/* Points badge */}
          <div className="flex items-center gap-1 rounded-full bg-amber-900/40 border border-amber-800/60 px-2.5 py-0.5">
            <span className="text-amber-400 text-[10px] font-semibold whitespace-nowrap">
              4382 pts of 500, 0 solved, 100%
            </span>
          </div>
          {/* Avatar / name */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white select-none">
              M
            </div>
            <span className="text-ziki-text text-xs font-medium">Muhammed</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen bg-ziki-bg text-ziki-text flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* 2. The ask */}
        <section aria-label="Plan request" className="space-y-2">
          <p className="text-ziki-muted text-sm">
            <strong className="text-ziki-text">{AGENT_NAME}</strong> wants to take{" "}
            <strong className="text-ziki-text">{ISSUE_NUMBER}</strong>
          </p>
          <div className="flex items-start gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-ziki-text leading-snug">
              {ISSUE_TITLE}
            </h1>
            <span className="flex-shrink-0 mt-0.5 inline-flex items-center rounded-full bg-orange-900/50 border border-orange-700/60 px-2.5 py-0.5 text-[11px] font-semibold text-orange-300 uppercase tracking-wide">
              High
            </span>
          </div>
          <p className="text-ziki-muted text-sm">{ESTIMATE_LINE}</p>
        </section>

        {/* 3. How Atlas read this task */}
        <section
          aria-labelledby="reading-heading"
          className="rounded-xl border border-ziki-border bg-ziki-surface p-5 space-y-3"
        >
          <h2
            id="reading-heading"
            className="text-[10px] font-semibold uppercase tracking-widest text-ziki-muted"
          >
            How {AGENT_NAME} Read This Task
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="text-ziki-muted flex-shrink-0 w-32 font-medium">My reading</dt>
              <dd className="text-ziki-text">{READING.myReading}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="text-ziki-muted flex-shrink-0 w-32 font-medium">Assumptions</dt>
              <dd className="text-ziki-text">{READING.assumptions}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="text-ziki-muted flex-shrink-0 w-32 font-medium">Not sure</dt>
              <dd className="text-ziki-text">{READING.notSure}</dd>
            </div>
          </dl>
        </section>

        {/* 4. The Plan — client component */}
        <PlanReview />

        {/* 5. Boundary strip */}
        <section
          aria-label="Responsibility boundary"
          className="rounded-xl border border-ziki-border bg-ziki-surface p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-1">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-ziki-muted">
              {AGENT_NAME} Does on Its Own
            </h3>
            <p className="text-sm text-ziki-text">{BOUNDARY.agentDoes}</p>
          </div>
          <div className="space-y-1 sm:border-l sm:border-ziki-border sm:pl-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-ziki-muted">
              Needs You
            </h3>
            <p className="text-sm text-ziki-text">{BOUNDARY.needsYou}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
