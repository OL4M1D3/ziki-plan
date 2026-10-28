"use client";

import { useReducer, useState, useEffect, Fragment } from "react";
import type { PlanState, PlanAction, Step } from "@/lib/types";
import {
  INITIAL_STEPS,
  READING,
  revisedReading,
  revisedSteps,
} from "@/data/plan";

// ─── Helpers ────────────────────────────────────────────────────────────────

function computeApprovalSummary(
  steps: Step[],
  originalStepIds: string[]
): string {
  const n = steps.length;
  const editedCount = steps.filter((s) => s.source === "edited").length;
  const addedCount = steps.filter((s) => s.source === "added").length;
  const originalPresentCount = steps.filter((s) =>
    originalStepIds.includes(s.id)
  ).length;
  const removedCount = Math.max(0, originalStepIds.length - originalPresentCount);

  const parts: string[] = [`${n} steps in the plan`];
  if (editedCount > 0) parts.push(`${editedCount} edited by you`);
  if (addedCount > 0) parts.push(`${addedCount} added by you`);
  if (removedCount > 0) parts.push(`${removedCount} removed`);

  return parts.join(" · ");
}

// ─── Reducer ────────────────────────────────────────────────────────────────

function planReducer(state: PlanState, action: PlanAction): PlanState {
  switch (action.type) {
    case "OPEN_EDIT": {
      const step = state.steps.find((s) => s.id === action.stepId);
      if (!step) return state;
      return {
        ...state,
        isSendBackOpen: false,
        activeEditor: { kind: "edit", stepId: action.stepId, draft: step.text },
      };
    }
    case "OPEN_INSERT": {
      return {
        ...state,
        isSendBackOpen: false,
        activeEditor: { kind: "insert", afterIndex: action.afterIndex, draft: "" },
      };
    }
    case "SET_DRAFT": {
      if (!state.activeEditor) return state;
      return {
        ...state,
        activeEditor: { ...state.activeEditor, draft: action.draft },
      };
    }
    case "SAVE_EDIT": {
      if (state.activeEditor?.kind !== "edit") return state;
      const { stepId, draft } = state.activeEditor;
      const trimmed = draft.trim();
      const steps = state.steps.map((s) => {
        if (s.id !== stepId) return s;
        if (trimmed === s.text) return s;
        return {
          ...s,
          text: trimmed,
          source: s.source === "added" ? ("added" as const) : ("edited" as const),
        };
      });
      return { ...state, steps, activeEditor: null };
    }
    case "SAVE_INSERT": {
      if (state.activeEditor?.kind !== "insert") return state;
      const { afterIndex, draft } = state.activeEditor;
      const trimmed = draft.trim();
      if (!trimmed) return state;
      const newStep: Step = {
        id: `s${state.nextId}`,
        text: trimmed,
        source: "added",
      };
      const steps = [...state.steps];
      steps.splice(afterIndex + 1, 0, newStep);
      return { ...state, steps, nextId: state.nextId + 1, activeEditor: null };
    }
    case "CANCEL_EDITOR": {
      return { ...state, activeEditor: null };
    }
    case "DELETE_STEP": {
      return {
        ...state,
        steps: state.steps.filter((s) => s.id !== action.stepId),
        activeEditor:
          state.activeEditor?.kind === "edit" &&
          state.activeEditor.stepId === action.stepId
            ? null
            : state.activeEditor,
      };
    }
    case "APPROVE": {
      if (state.steps.length === 0) return state;
      return {
        ...state,
        status: "approved",
        isSendBackOpen: false,
        activeEditor: null,
      };
    }
    case "OPEN_SEND_BACK": {
      return {
        ...state,
        isSendBackOpen: true,
        activeEditor: null,
      };
    }
    case "CANCEL_SEND_BACK": {
      return {
        ...state,
        isSendBackOpen: false,
      };
    }
    case "SEND_BACK": {
      const comment = action.comment.trim();
      if (!comment) return state;
      const steps = revisedSteps.map((s) => ({ ...s }));
      return {
        ...state,
        status: "revised",
        steps,
        originalStepIds: steps.map((s) => s.id),
        sendBackComment: comment,
        isSendBackOpen: false,
        activeEditor: null,
        nextId: 200,
      };
    }
    default:
      return state;
  }
}

const INITIAL_STATE: PlanState = {
  steps: INITIAL_STEPS,
  nextId: 100,
  activeEditor: null,
  status: "reviewing",
  originalStepIds: INITIAL_STEPS.map((s) => s.id),
  sendBackComment: null,
  isSendBackOpen: false,
};

// ─── InsertControl ───────────────────────────────────────────────────────────

function InsertControl({
  afterIndex,
  label,
  dispatch,
  activeEditor,
}: {
  afterIndex: number;
  label: string;
  dispatch: React.Dispatch<PlanAction>;
  activeEditor: PlanState["activeEditor"];
}) {
  const isOpen =
    activeEditor?.kind === "insert" && activeEditor.afterIndex === afterIndex;

  if (isOpen) {
    const draft = activeEditor!.draft;
    const canSave = draft.trim().length > 0;
    return (
      <li className="list-none my-1">
        <div className="rounded-2xl border border-ziki-border bg-ziki-surface p-3 space-y-2">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => dispatch({ type: "SET_DRAFT", draft: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Escape") dispatch({ type: "CANCEL_EDITOR" });
            }}
            className="w-full resize-none rounded-xl border border-ziki-border bg-ziki-bg text-ziki-text text-sm p-2.5 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-ziki-blue"
            placeholder="Describe the new step…"
            aria-label={
              afterIndex === -1
                ? "New step text before step 1"
                : `New step text after step ${afterIndex + 1}`
            }
          />
          <div className="flex gap-2">
            <button
              disabled={!canSave}
              onClick={() => dispatch({ type: "SAVE_INSERT" })}
              className="px-3.5 py-1 text-xs rounded-lg bg-ziki-blue text-white font-medium disabled:opacity-40 hover:bg-ziki-blue-hover focus:outline-none focus:ring-2 focus:ring-ziki-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ziki-bg motion-safe:transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => dispatch({ type: "CANCEL_EDITOR" })}
              className="px-3.5 py-1 text-xs rounded-lg border border-ziki-border text-ziki-muted hover:text-ziki-text hover:border-ziki-text-secondary focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="list-none my-0.5" aria-label={label}>
      <button
        onClick={() => dispatch({ type: "OPEN_INSERT", afterIndex })}
        className="w-full text-left text-xs text-ziki-muted hover:text-ziki-blue focus:outline-none focus:ring-2 focus:ring-ziki-blue rounded px-2 py-1 motion-safe:transition-colors"
        aria-label={label}
      >
        + Insert step here
      </button>
    </li>
  );
}

// ─── StepItem ────────────────────────────────────────────────────────────────

function StepItem({
  step,
  index,
  dispatch,
  activeEditor,
}: {
  step: Step;
  index: number;
  dispatch: React.Dispatch<PlanAction>;
  activeEditor: PlanState["activeEditor"];
}) {
  const num = index + 1;
  const isEditing =
    activeEditor?.kind === "edit" && activeEditor.stepId === step.id;

  return (
    <li className="group relative">
      <div className="flex gap-3 rounded-2xl border border-transparent hover:border-ziki-border p-2.5 motion-safe:transition-colors">
        <span
          aria-hidden="true"
          className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-ziki-bg border border-ziki-border text-xs text-ziki-muted flex items-center justify-center font-mono select-none"
        >
          {num}
        </span>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <EditForm
              stepNumber={num}
              dispatch={dispatch}
              draft={activeEditor!.draft}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-ziki-text leading-snug">{step.text}</span>
              {step.source === "edited" && (
                <span className="text-[10px] text-ziki-muted font-medium uppercase tracking-wide">
                  edited by you
                </span>
              )}
              {step.source === "added" && (
                <span className="text-[10px] text-ziki-blue font-medium uppercase tracking-wide">
                  added by you
                </span>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex-shrink-0 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 motion-safe:transition-opacity">
            <button
              onClick={() => dispatch({ type: "OPEN_EDIT", stepId: step.id })}
              className="px-2.5 py-1 text-xs rounded-lg border border-ziki-border bg-ziki-surface text-ziki-muted hover:text-ziki-text hover:border-ziki-border-subtle focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
              aria-label={`Edit step ${num}`}
            >
              Edit
            </button>
            <button
              onClick={() => dispatch({ type: "DELETE_STEP", stepId: step.id })}
              className="px-2.5 py-1 text-xs rounded-lg border border-ziki-danger-border bg-ziki-danger-bg text-ziki-danger-text hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-ziki-danger-text motion-safe:transition-colors"
              aria-label={`Delete step ${num}`}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

// ─── EditForm ────────────────────────────────────────────────────────────────

function EditForm({
  stepNumber,
  dispatch,
  draft,
}: {
  stepNumber: number;
  dispatch: React.Dispatch<PlanAction>;
  draft: string;
}) {
  const canSave = draft.trim().length > 0;
  return (
    <div className="space-y-2">
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => dispatch({ type: "SET_DRAFT", draft: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Escape") dispatch({ type: "CANCEL_EDITOR" });
        }}
        className="w-full resize-none rounded-xl border border-ziki-border bg-ziki-bg text-ziki-text text-sm p-2.5 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-ziki-blue"
        aria-label={`Edit text for step ${stepNumber}`}
      />
      <div className="flex gap-2">
        <button
          disabled={!canSave}
          onClick={() => dispatch({ type: "SAVE_EDIT" })}
          className="px-3.5 py-1 text-xs rounded-lg bg-ziki-blue text-white font-medium disabled:opacity-40 hover:bg-ziki-blue-hover focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => dispatch({ type: "CANCEL_EDITOR" })}
          className="px-3.5 py-1 text-xs rounded-lg border border-ziki-border text-ziki-muted hover:text-ziki-text hover:border-ziki-text-secondary focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── SendBackBox ─────────────────────────────────────────────────────────────

function SendBackBox({
  dispatch,
}: {
  dispatch: React.Dispatch<PlanAction>;
}) {
  const [comment, setComment] = useState("");
  const canSend = comment.trim().length > 0;

  return (
    <div className="rounded-[24px] border border-ziki-border bg-ziki-surface p-5 space-y-3">
      <label
        htmlFor="send-back-comment"
        className="block text-xs font-semibold text-ziki-muted uppercase tracking-wider"
      >
        What should Atlas change?
      </label>
      <textarea
        id="send-back-comment"
        autoFocus
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") dispatch({ type: "CANCEL_SEND_BACK" });
        }}
        placeholder="For example: copy changes only, no redesign"
        className="w-full resize-none rounded-xl border border-ziki-border bg-ziki-bg text-ziki-text text-sm p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ziki-blue"
        aria-label="What should Atlas change?"
      />
      <div className="flex gap-2">
        <button
          disabled={!canSend}
          onClick={() => dispatch({ type: "SEND_BACK", comment })}
          className="px-4 py-2 text-xs rounded-lg bg-ziki-blue text-white font-medium disabled:opacity-40 hover:bg-ziki-blue-hover focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
          aria-label="Send comment to Atlas"
        >
          Send
        </button>
        <button
          onClick={() => dispatch({ type: "CANCEL_SEND_BACK" })}
          className="px-4 py-2 text-xs rounded-lg border border-ziki-border text-ziki-muted hover:text-ziki-text hover:border-ziki-text-secondary focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── ConfirmationCard ────────────────────────────────────────────────────────

function ConfirmationCard({
  steps,
  originalStepIds,
}: {
  steps: Step[];
  originalStepIds: string[];
}) {
  const summary = computeApprovalSummary(steps, originalStepIds);

  return (
    <section
      role="status"
      aria-label="Approved plan confirmation"
      className="rounded-[24px] border border-ziki-border bg-ziki-surface p-6 space-y-4"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-ziki-text">
          Bid sent with your edits
        </h2>
        <p className="text-sm text-ziki-muted">
          Atlas will start on #118 and report progress.
        </p>
        <p className="text-xs text-ziki-blue font-medium pt-1">
          {summary}
        </p>
      </div>

      <ol aria-label="Approved plan steps" className="space-y-2 pt-2 border-t border-ziki-border">
        {steps.map((step, idx) => (
          <li
            key={step.id}
            className="flex gap-3 rounded-xl border border-ziki-border-subtle bg-ziki-bg/40 p-2.5"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-ziki-surface border border-ziki-border text-xs text-ziki-muted flex items-center justify-center font-mono select-none"
            >
              {idx + 1}
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-sm text-ziki-text leading-snug">{step.text}</span>
              {step.source === "edited" && (
                <span className="text-[10px] text-ziki-muted font-medium uppercase tracking-wide">
                  edited by you
                </span>
              )}
              {step.source === "added" && (
                <span className="text-[10px] text-ziki-blue font-medium uppercase tracking-wide">
                  added by you
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── PlanReview (main export) ────────────────────────────────────────────────

export default function PlanReview() {
  const [state, dispatch] = useReducer(planReducer, INITIAL_STATE);
  const { steps, activeEditor, status, originalStepIds, sendBackComment, isSendBackOpen } = state;
  const isEmpty = steps.length === 0;

  // Sync "How Atlas read this task" block when revised
  useEffect(() => {
    const section = document.querySelector(
      'section[aria-labelledby="reading-heading"]'
    );
    if (!section) return;
    const dds = section.querySelectorAll("dd");
    if (dds.length >= 3) {
      if (status === "revised") {
        dds[0].textContent = revisedReading.reading;
        dds[1].textContent = revisedReading.assumptions;
        dds[2].textContent = revisedReading.unsure;
      } else {
        dds[0].textContent = READING.myReading;
        dds[1].textContent = READING.assumptions;
        dds[2].textContent = READING.notSure;
      }
    }
  }, [status]);

  if (status === "approved") {
    return (
      <ConfirmationCard
        steps={steps}
        originalStepIds={originalStepIds}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Revised banner notice */}
      {status === "revised" && sendBackComment && (
        <div
          role="status"
          className="text-xs text-ziki-muted rounded-2xl bg-ziki-surface border border-ziki-border px-4 py-2.5 flex items-center gap-1.5"
        >
          <span>You sent this back: &ldquo;{sendBackComment}&rdquo;</span>
        </div>
      )}

      {/* THE PLAN block */}
      <section aria-labelledby="plan-heading" className="rounded-[24px] border border-ziki-border bg-ziki-surface p-6">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <h2
            id="plan-heading"
            className="text-[11px] font-semibold uppercase tracking-widest text-ziki-muted"
          >
            The Plan
          </h2>
          {status === "revised" && (
            <span className="text-[10px] font-medium text-ziki-blue bg-ziki-blue-tint border border-ziki-blue-tint-border rounded-full px-2.5 py-0.5">
              Revised after your comment
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="space-y-3">
            <p className="text-sm text-ziki-muted italic">
              A plan needs at least one step.
            </p>
            <ol aria-label="Plan steps">
              <InsertControl
                afterIndex={-1}
                label="Insert step at the beginning"
                dispatch={dispatch}
                activeEditor={activeEditor}
              />
            </ol>
          </div>
        ) : (
          <ol aria-label="Plan steps" className="space-y-0">
            <InsertControl
              afterIndex={-1}
              label="Insert step before step 1"
              dispatch={dispatch}
              activeEditor={activeEditor}
            />

            {steps.map((step, idx) => (
              <Fragment key={step.id}>
                <StepItem
                  step={step}
                  index={idx}
                  dispatch={dispatch}
                  activeEditor={activeEditor}
                />
                <InsertControl
                  key={`ins-${step.id}`}
                  afterIndex={idx}
                  label={`Insert step after step ${idx + 1}`}
                  dispatch={dispatch}
                  activeEditor={activeEditor}
                />
              </Fragment>
            ))}
          </ol>
        )}
      </section>

      {/* Decision buttons or comment box */}
      {isSendBackOpen ? (
        <SendBackBox dispatch={dispatch} />
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            disabled={isEmpty}
            aria-disabled={isEmpty}
            onClick={() => dispatch({ type: "APPROVE" })}
            title={isEmpty ? "A plan needs at least one step." : undefined}
            className="flex-1 py-3 px-6 rounded-2xl bg-ziki-blue text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ziki-blue-hover focus:outline-none focus:ring-2 focus:ring-ziki-blue focus:ring-offset-2 focus:ring-offset-ziki-bg motion-safe:transition-colors shadow-sm"
          >
            Approve
          </button>
          <button
            onClick={() => dispatch({ type: "OPEN_SEND_BACK" })}
            className="flex-1 py-3 px-6 rounded-2xl border border-ziki-border bg-transparent text-ziki-text font-semibold text-sm hover:bg-ziki-surface focus:outline-none focus:ring-2 focus:ring-ziki-blue focus:ring-offset-2 focus:ring-offset-ziki-bg motion-safe:transition-colors"
          >
            Send back
          </button>
        </div>
      )}

      {isEmpty && (
        <p role="alert" className="text-xs text-ziki-muted text-center">
          A plan needs at least one step.
        </p>
      )}
    </div>
  );
}
