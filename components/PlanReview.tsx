"use client";

import { useReducer, Fragment } from "react";
import type { PlanState, PlanAction, Step } from "@/lib/types";
import { INITIAL_STEPS } from "@/data/plan";

// ─── Reducer ────────────────────────────────────────────────────────────────

function planReducer(state: PlanState, action: PlanAction): PlanState {
  switch (action.type) {
    case "OPEN_EDIT": {
      const step = state.steps.find((s) => s.id === action.stepId);
      if (!step) return state;
      return {
        ...state,
        activeEditor: { kind: "edit", stepId: action.stepId, draft: step.text },
      };
    }
    case "OPEN_INSERT": {
      return {
        ...state,
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
    default:
      return state;
  }
}

const INITIAL_STATE: PlanState = {
  steps: INITIAL_STEPS,
  nextId: 100,
  activeEditor: null,
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
        <div className="rounded-lg border border-ziki-border bg-ziki-surface p-3 space-y-2">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => dispatch({ type: "SET_DRAFT", draft: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Escape") dispatch({ type: "CANCEL_EDITOR" });
            }}
            className="w-full resize-none rounded border border-ziki-border bg-ziki-bg text-ziki-text text-sm p-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-ziki-blue"
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
              className="px-3 py-1 text-xs rounded bg-ziki-blue text-white font-medium disabled:opacity-40 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-ziki-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ziki-bg motion-safe:transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => dispatch({ type: "CANCEL_EDITOR" })}
              className="px-3 py-1 text-xs rounded border border-ziki-border text-ziki-muted hover:text-ziki-text hover:border-ziki-text focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
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
      <div className="flex gap-3 rounded-lg border border-transparent hover:border-ziki-border p-2 motion-safe:transition-colors">
        {/* Step number */}
        <span
          aria-hidden="true"
          className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-ziki-surface border border-ziki-border text-xs text-ziki-muted flex items-center justify-center font-mono select-none"
        >
          {num}
        </span>

        {/* Content */}
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

        {/* Action buttons — only when not editing */}
        {!isEditing && (
          <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 motion-safe:transition-opacity">
            <button
              onClick={() => dispatch({ type: "OPEN_EDIT", stepId: step.id })}
              className="px-2 py-0.5 text-xs rounded border border-ziki-border text-ziki-muted hover:text-ziki-text hover:border-ziki-text focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
              aria-label={`Edit step ${num}`}
            >
              Edit
            </button>
            <button
              onClick={() => dispatch({ type: "DELETE_STEP", stepId: step.id })}
              className="px-2 py-0.5 text-xs rounded border border-red-900 text-red-400 hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-500 motion-safe:transition-colors"
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
        className="w-full resize-none rounded border border-ziki-border bg-ziki-bg text-ziki-text text-sm p-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-ziki-blue"
        aria-label={`Edit text for step ${stepNumber}`}
      />
      <div className="flex gap-2">
        <button
          disabled={!canSave}
          onClick={() => dispatch({ type: "SAVE_EDIT" })}
          className="px-3 py-1 text-xs rounded bg-ziki-blue text-white font-medium disabled:opacity-40 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => dispatch({ type: "CANCEL_EDITOR" })}
          className="px-3 py-1 text-xs rounded border border-ziki-border text-ziki-muted hover:text-ziki-text hover:border-ziki-text focus:outline-none focus:ring-2 focus:ring-ziki-blue motion-safe:transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── PlanReview (main export) ────────────────────────────────────────────────

export default function PlanReview() {
  const [state, dispatch] = useReducer(planReducer, INITIAL_STATE);
  const { steps, activeEditor } = state;
  const isEmpty = steps.length === 0;

  return (
    <div className="w-full space-y-6">
      {/* THE PLAN block */}
      <section aria-labelledby="plan-heading" className="rounded-xl border border-ziki-border bg-ziki-surface p-5">
        <h2
          id="plan-heading"
          className="text-[10px] font-semibold uppercase tracking-widest text-ziki-muted mb-4"
        >
          The Plan
        </h2>

        {isEmpty ? (
          <div className="space-y-3">
            <p className="text-sm text-ziki-muted italic">
              A plan needs at least one step.
            </p>
            {/* Insert control still works on empty state */}
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
            {/* Insert before first step */}
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
                {/* Insert after each step */}
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

      {/* Decision buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          disabled={isEmpty}
          aria-disabled={isEmpty}
          title={isEmpty ? "A plan needs at least one step." : undefined}
          className="flex-1 py-2.5 px-6 rounded-lg bg-ziki-blue text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-ziki-blue focus:ring-offset-2 focus:ring-offset-ziki-bg motion-safe:transition-colors"
        >
          Approve
        </button>
        <button className="flex-1 py-2.5 px-6 rounded-lg border border-ziki-border text-ziki-text font-semibold text-sm hover:bg-ziki-surface focus:outline-none focus:ring-2 focus:ring-ziki-blue focus:ring-offset-2 focus:ring-offset-ziki-bg motion-safe:transition-colors">
          Send back
        </button>
      </div>

      {isEmpty && (
        <p role="alert" className="text-xs text-ziki-muted text-center">
          A plan needs at least one step.
        </p>
      )}
    </div>
  );
}
