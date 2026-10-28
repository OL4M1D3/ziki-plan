export type StepSource = "agent" | "edited" | "added";

export interface Step {
  id: string;
  text: string;
  source: StepSource;
}

export type ActiveEditor =
  | { kind: "edit"; stepId: string; draft: string }
  | { kind: "insert"; afterIndex: number; draft: string }
  | null;

export interface PlanState {
  steps: Step[];
  nextId: number;
  activeEditor: ActiveEditor;
}

export type PlanAction =
  | { type: "OPEN_EDIT"; stepId: string }
  | { type: "OPEN_INSERT"; afterIndex: number }
  | { type: "SET_DRAFT"; draft: string }
  | { type: "SAVE_EDIT" }
  | { type: "SAVE_INSERT" }
  | { type: "CANCEL_EDITOR" }
  | { type: "DELETE_STEP"; stepId: string };
