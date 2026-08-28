# AGENTS.md

Instructions for AI coding agents working in this repository.

Read this file completely before making changes.

## Project Context

This repository is a TikTok Live + Minecraft integration project.

Before making changes:

- Inspect the existing project structure.
- Identify the application entry points.
- Identify how TikTok events are received and processed.
- Identify how Minecraft commands/messages are sent.
- Identify how the dashboard/server communicates with the backend.
- Determine the package manager and available scripts from `package.json`.
- Do not assume a framework or architecture without inspecting the repository.

## Core Rules

1. Preserve existing functionality unless the task explicitly requires changing it.
2. Do not rewrite large sections of working code when a smaller change is sufficient.
3. Do not modify unrelated files.
4. Do not delete existing features without explicit approval.
5. Never expose, print, commit, or modify secrets, API keys, tokens, passwords, or `.env` values.
6. Never run destructive commands such as:
   - `rm -rf`
   - force pushes
   - database deletion
   - destructive production commands
7. Ask for approval before adding a new dependency.
8. If a dependency is necessary, explain:
   - what package is needed
   - why it is needed
   - whether an existing dependency can accomplish the same thing
9. Do not guess when the intended behavior is unclear. Ask first.

## Scope

Stay strictly within the requested task.

If an unrelated bug, refactor, or improvement is discovered:

- Do not fix it automatically.
- Mention it in the final summary.
- Explain why it was left unchanged.

## Workflow

For every task:

### 1. Inspect First

Before editing:

- Read the relevant files.
- Trace the existing data flow.
- Identify dependencies between components.
- Check existing tests and scripts.

Do not modify files during the initial investigation unless explicitly requested.

### 2. Plan

Before implementing a non-trivial change, provide a short plan containing:

- files that will be changed
- what will be changed
- why the change is needed
- how it will be tested

### 3. Implement Minimally

Make the smallest change that correctly solves the task.

Do not:

- reformat unrelated code
- rename unrelated variables
- reorganize unrelated files
- perform unnecessary refactoring

### 4. Testing

Before declaring the task complete:

- Run the relevant existing tests.
- Add or update tests when the behavior being changed is testable.
- Run the project's test command if one exists.
- If no tests exist, explain that clearly.

Never claim a test passed unless it was actually run.

### 5. Verification

After making changes:

- Run relevant tests.
- Run the project's lint/format command if available.
- Check the final diff.
- Make sure no unrelated files were modified.

### 6. Final Summary

At the end, report:

- what changed
- why it changed
- tests/checks that were run
- whether they passed
- anything intentionally left out of scope
- any follow-up issues discovered

## TikTok Integration

When modifying TikTok functionality:

- Preserve the existing event architecture.
- Inspect existing TikTok listeners before creating new ones.
- Avoid duplicating event listeners.
- Handle connection errors and event errors explicitly.
- Do not expose TikTok credentials or connection secrets.
- Do not change unrelated Minecraft functionality unless required.

## Minecraft Integration

When modifying Minecraft functionality:

- Inspect the existing Minecraft connection layer first.
- Preserve the existing connection mechanism.
- Do not assume a specific Minecraft version without checking the project configuration.
- Do not modify server/world configuration unless explicitly requested.
- Avoid sending commands repeatedly unless the requested feature requires it.
- Handle Minecraft connection failures gracefully.

## Dashboard / Server

When modifying the dashboard or server:

- Preserve existing API/event behavior unless the task requires a change.
- Check both the backend and frontend sides of an interface before changing it.
- Keep existing event names and payload structures compatible when possible.
- Do not expose secrets through frontend code.

## Code Style

Follow the existing project's style.

Before introducing a new pattern:

- inspect nearby code
- follow existing naming conventions
- follow existing module/import conventions
- follow the project's existing formatting configuration

Do not introduce a new framework or architectural pattern unless explicitly requested.

## Dependencies

Before adding a dependency:

1. Check whether the project already has an equivalent dependency.
2. Check whether the functionality can reasonably be implemented with existing tools.
3. Ask for approval before installing the dependency.

## Parallel Work

If multiple Codex sessions are working on this repository:

- Each session must have a clearly defined scope.
- Do not modify files owned by another session.
- Avoid overlapping changes.
- Review the current git diff before editing.

## Git Safety

Before making substantial changes:

- Inspect the current git status.
- Do not discard existing user changes.
- Do not reset or overwrite user work.
- Do not force-push.
- Do not create commits unless explicitly requested.

## Important Principle

Prefer:

> Understand → Plan → Test → Change → Verify

over:

> Guess → Rewrite → Hope