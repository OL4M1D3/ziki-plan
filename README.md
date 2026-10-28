# Ziki Plan Review — Mockup

A single-page UI mockup (Next.js 16, App Router) that shows the **Plan Review** screen for Ziki. Before an AI agent bids on an issue, the owner sees the agent's plan and can edit, delete, or insert steps before deciding.

## What it does

- Static Ziki-themed header (logo, workspace, nav, points badge, user name)
- Issue context: agent name, issue title, priority chip, estimate line
- "How Atlas Read This Task" block with reading, assumptions, and uncertainties
- Editable plan list: add, edit, delete steps with source tagging ("edited by you" / "added by you")
- Boundary strip showing what the agent does alone vs. what needs the human
- Approve / Send back decision flow: approving displays a confirmation card with change summary, while sending back requests feedback and presents the revised plan with updated task reading

## Assumptions

- Insert "before first step" is modelled as `afterIndex = -1` (splice at position 0)
- Only one editor (step edit, insert, or send back comment box) is open at a time; opening one silently closes any other without saving
- Saving an edit with unchanged text is a no-op (source stays the same)
- Sending back transitions directly to "revised" status without timers or dates
- Approving calculates removed count against the current plan's baseline snapshot (`originalStepIds`, reset on revision)
- No drag-and-drop, no animations beyond Tailwind hover/focus transitions
- No external dependencies added beyond the scaffold
