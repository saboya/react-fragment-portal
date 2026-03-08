# AGENTS.md

Guidance for AI coding agents working in this repository.

## Repository purpose

`react-fragment-portal` provides a `FragmentPortal` React component that renders portal children without introducing an extra wrapper/container element.

This is intended for browser-only DOM augmentation use cases (for example, Chrome extension content scripts injecting valid children like `<li>` into existing `<ul>` structures).

## Scope and constraints

- Intended runtime: browser DOM
- Not intended for SSR
- Keep DOM semantics intact (no extra wrapper nodes)
- Favor compatibility with older browser/runtime baselines where practical

## Key files

- `src/FragmentPortal.ts` - core implementation
- `src/index.ts` - public export surface
- `test/FragmentPortal.test.ts` - behavior tests (Vitest + Testing Library)
- `README.md` - usage and context
- `.github/workflows/ci.yml` - CI matrix (Node + React versions)
- `.ai_skills/verify-github-pipeline-with-act.md` - local CI verification via `act`

## Development commands

- `npm run build` - build CJS + ESM outputs via `tsc-multi`
- `npm test` - run Vitest tests
- `npm run lint` - run oxlint + biome checks
- `npm run format` - format files with biome

## Testing expectations

When changing behavior in `FragmentPortal`:

1. Update/add tests in `test/FragmentPortal.test.ts`
2. Ensure local:
   - `npm run build`
   - `npm test`
3. CI validates matrix compatibility for:
   - Node: 22, 24
   - React: 18.2.0, 19.2.0

## CI compatibility strategy

Do not rely on in-process React aliasing for multi-version testing.
Use the workflow strategy in `.github/workflows/ci.yml`, which installs one React/ReactDOM version per matrix job.

## Implementation notes for agents

- Preserve the wrapperless insertion goal.
- Be cautious with event listener proxying and cleanup behavior.
- Avoid introducing APIs requiring newer JS baselines unless necessary (for example, prefer `arr[0]` over `arr.at(0)`).
- Keep TypeScript strictness intact.
- Keep build output focused on `src/**` only (tests are excluded from build compilation).

## Change hygiene

- Keep changes minimal and focused.
- Do not add unrelated refactors.
- Update README when user-facing behavior or intent changes.
- If pipeline changes are made, verify with `act` using the local skill doc.

## Local CI verification (optional)

Follow `.ai_skills/verify-github-pipeline-with-act.md` to run:

- prerequisite checks (`act`, Docker)
- local workflow execution with `act`
- matrix result verification
