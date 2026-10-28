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

export type PlanStatus = "reviewing" | "approved" | "sent_back" | "revised";

export interface PlanState {
  steps: Step[];
  nextId: number;
  activeEditor: ActiveEditor;
  status: PlanStatus;
  originalStepIds: string[];
  sendBackComment: string | null;
  isSendBackOpen: boolean;
}

export type PlanAction =
  | { type: "OPEN_EDIT"; stepId: string }
  | { type: "OPEN_INSERT"; afterIndex: number }
  | { type: "SET_DRAFT"; draft: string }
  | { type: "SAVE_EDIT" }
  | { type: "SAVE_INSERT" }
  | { type: "CANCEL_EDITOR" }
  | { type: "DELETE_STEP"; stepId: string }
  | { type: "APPROVE" }
  | { type: "OPEN_SEND_BACK" }
  | { type: "CANCEL_SEND_BACK" }
  | { type: "SEND_BACK"; comment: string };
