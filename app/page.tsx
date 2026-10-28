import PlanReview from "@/components/PlanReview";
import {
  ZikiMark,
  ChevronDownIcon,
  ProductIcon,
  MarketingIcon,
  SecurityIcon,
  RobotIcon,
  TrophyIcon,
  BellIcon,
} from "@/components/icons";
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
    <header className="w-full border-b border-ziki-border bg-ziki-header-bg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-1 sm:gap-3">
        {/* Left cluster: Logo, Divider, Workspace, Nav */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Logo */}
          <a
            href="#"
            aria-label="Ziki home"
            className="flex items-center gap-2 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue py-1"
          >
            <ZikiMark className="h-6 w-auto" />
            <span className="font-bold text-sm tracking-tight text-ziki-text hidden sm:inline">
              ziki
            </span>
          </a>

          {/* Vertical divider */}
          <span
            className="h-4 w-px bg-ziki-border mx-1 shrink-0"
            aria-hidden="true"
          />

          {/* Workspace switcher (static) */}
          <button
            type="button"
            aria-label="Active workspace: Zedu"
            className="inline-flex items-center gap-1 text-sm font-medium text-ziki-text hover:text-white px-1.5 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue shrink-0"
          >
            <span>Zedu</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-ziki-muted" />
          </button>

          {/* Navigation items: Product, Marketing, Security */}
          <nav aria-label="Main navigation" className="flex items-center gap-0.5 sm:gap-1 ml-1">
            <button
              type="button"
              aria-label="Product"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ziki-text hover:text-white px-2 py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue"
            >
              <ProductIcon className="w-3.5 h-3.5 text-ziki-text" />
              <span className="hidden md:inline">Product</span>
            </button>
            <button
              type="button"
              aria-label="Marketing"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ziki-muted hover:text-ziki-text px-2 py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue"
            >
              <MarketingIcon className="w-3.5 h-3.5 text-ziki-muted" />
              <span className="hidden md:inline">Marketing</span>
            </button>
            <button
              type="button"
              aria-label="Security"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ziki-muted hover:text-ziki-text px-2 py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue"
            >
              <SecurityIcon className="w-3.5 h-3.5 text-ziki-muted" />
              <span className="hidden md:inline">Security</span>
            </button>
          </nav>
        </div>

        {/* Right cluster: Agents, Muhammed, Trophy Points, Notification Bell */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Agents pill button */}
          <button
            type="button"
            aria-label="Agents"
            className="inline-flex items-center gap-1.5 rounded-full border border-ziki-border bg-ziki-surface/60 hover:bg-ziki-surface px-2.5 sm:px-3 py-1 text-xs font-medium text-ziki-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue shrink-0"
          >
            <RobotIcon className="w-3.5 h-3.5 text-ziki-blue" />
            <span className="hidden md:inline">Agents</span>
            <ChevronDownIcon className="w-3 h-3 text-ziki-muted hidden md:inline" />
          </button>

          {/* User profile pill button */}
          <button
            type="button"
            aria-label="Account menu for Muhammed"
            className="inline-flex items-center gap-1.5 rounded-full border border-ziki-border bg-ziki-surface/60 hover:bg-ziki-surface p-1 sm:pr-2.5 text-xs font-medium text-ziki-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue shrink-0"
          >
            <span className="w-6 h-6 rounded-full bg-ziki-avatar-bg text-white font-bold flex items-center justify-center text-xs shrink-0 select-none">
              M
            </span>
            <span className="hidden md:inline">Muhammed</span>
            <ChevronDownIcon className="w-3 h-3 text-ziki-muted hidden md:inline" />
          </button>

          {/* Gold points pill button */}
          <button
            type="button"
            aria-label="Points: 4382.08 pts"
            className="inline-flex items-center gap-1.5 rounded-full border border-ziki-gold-border bg-ziki-gold-bg px-2.5 sm:px-3 py-1 text-xs font-semibold text-ziki-gold-text hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue shrink-0"
          >
            <TrophyIcon className="w-3.5 h-3.5 text-ziki-gold-text" />
            <span className="tabular-nums">4382.08 pts</span>
          </button>

          {/* Notification bell button */}
          <button
            type="button"
            aria-label="Notifications, 14 unread"
            className="relative inline-flex items-center justify-center w-8 h-8 rounded-full text-ziki-muted hover:text-ziki-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ziki-blue shrink-0"
          >
            <BellIcon className="w-4 h-4" />
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ziki-blue px-1 text-[10px] font-bold text-white select-none"
            >
              14
            </span>
          </button>
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
            <span className="flex-shrink-0 mt-0.5 inline-flex items-center rounded-full bg-ziki-orange-bg border border-ziki-orange-border px-2.5 py-0.5 text-[11px] font-semibold text-ziki-orange-text uppercase tracking-wide">
              High
            </span>
          </div>
          <p className="text-ziki-muted text-sm">{ESTIMATE_LINE}</p>
        </section>

        {/* 3. How Atlas read this task */}
        <section
          aria-labelledby="reading-heading"
          className="rounded-[24px] border border-ziki-border bg-ziki-surface p-6 space-y-3"
        >
          <h2
            id="reading-heading"
            className="text-[11px] font-semibold uppercase tracking-widest text-ziki-muted"
          >
            How {AGENT_NAME} Read This Task
          </h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-ziki-muted flex-shrink-0 w-32 font-medium">My reading</dt>
              <dd className="text-ziki-text">{READING.myReading}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-ziki-muted flex-shrink-0 w-32 font-medium">Assumptions</dt>
              <dd className="text-ziki-text">{READING.assumptions}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
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
          className="rounded-[24px] border border-ziki-border bg-ziki-surface p-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <div className="space-y-1.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ziki-muted">
              {AGENT_NAME} Does on Its Own
            </h3>
            <p className="text-sm text-ziki-text leading-relaxed">{BOUNDARY.agentDoes}</p>
          </div>
          <div className="space-y-1.5 sm:border-l sm:border-ziki-border sm:pl-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ziki-muted">
              Needs You
            </h3>
            <p className="text-sm text-ziki-text leading-relaxed">{BOUNDARY.needsYou}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
