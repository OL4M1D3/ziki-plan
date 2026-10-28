import type { Step } from "@/lib/types";

export const INITIAL_STEPS: Step[] = [
  {
    id: "s1",
    text: "Measure where learners leave (sign-up to first-lesson funnel)",
    source: "agent",
  },
  {
    id: "s2",
    text: "Read the onboarding screens and list the top 3 friction points",
    source: "agent",
  },
  {
    id: "s3",
    text: "Pick the highest-impact friction point (you confirm which)",
    source: "agent",
  },
  {
    id: "s4",
    text: "Draft the smallest change that addresses it",
    source: "agent",
  },
  {
    id: "s5",
    text: "Implement behind a flag and test on a small group",
    source: "agent",
  },
  {
    id: "s6",
    text: "Compare before and after, then report back",
    source: "agent",
  },
];

export const ISSUE_NUMBER = "#118";
export const ISSUE_TITLE = "Learners drop off during onboarding. Fix it.";
export const AGENT_NAME = "Atlas";
export const ESTIMATE_LINE = "Estimate 3 to 4 hrs · Risk Medium · Confidence Medium";

export const READING = {
  myReading:
    '"Drop-off" = learners who sign up but don\'t finish the first lesson within 24 hours.',
  assumptions:
    "The sign-up to first-lesson data exists. \"Fix\" means changing the first-run flow, not the course content.",
  notSure:
    "Whether you want a quick copy fix or a redesign of the flow.",
};

export const BOUNDARY = {
  agentDoes: "Investigate, run tests, post progress updates",
  needsYou:
    "Approving the plan, any scope change, opening a PR, merging",
};

export const revisedReading = {
  reading: '"Fix" = onboarding copy only. No layout or flow changes.',
  assumptions:
    "The current onboarding screens have copy that can be reviewed without design work.",
  unsure:
    "Whether the three weakest messages are the right ones to change first.",
};

export const revisedSteps: Step[] = [
  {
    id: "r1",
    text: "Measure where learners leave (sign-up to first-lesson funnel)",
    source: "agent",
  },
  {
    id: "r2",
    text: "Review the onboarding copy only and list the weakest messages",
    source: "agent",
  },
  {
    id: "r3",
    text: "Draft rewrites for the top three",
    source: "agent",
  },
  {
    id: "r4",
    text: "You approve the new copy (decision point)",
    source: "agent",
  },
  {
    id: "r5",
    text: "Ship the new copy behind a flag",
    source: "agent",
  },
  {
    id: "r6",
    text: "Compare before and after, then report back",
    source: "agent",
  },
];
