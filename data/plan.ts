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
