---
name: verify-github-pipeline-with-act
description: Verify the GitHub Actions CI workflow locally with act, including prerequisite checks for act and Docker.
---

# Verify GitHub Pipeline With act

Use this skill when you need to validate `.github/workflows/ci.yml` locally.

## Preconditions

1. You are in the repository root.
2. Docker is installed and running.
3. `act` is installed and available in `PATH`.

## Step 1: Verify `act` is installed

Run:

```bash
act --version
```

Expected result:

- Command exits with code `0`.
- Prints an `act` version.

If this fails:

- Install `act` and rerun this skill.

## Step 2: Verify Docker is installed and daemon is running

Run:

```bash
docker --version
docker info
```

Expected result:

- `docker --version` prints a version string.
- `docker info` exits with code `0` and shows daemon details.

If this fails:

- Start Docker (or Colima/OrbStack/Docker Desktop).
- Verify daemon connectivity before continuing.

## Step 3: Verify workflow file exists

Run:

```bash
ls .github/workflows/ci.yml
```

Expected result:

- File exists and path is printed.

## Step 4: Run the workflow with act

Primary command for Apple Silicon:

```bash
act --container-architecture linux/arm64 -P micro
```

Fallback command if needed:

```bash
act --container-architecture linux/amd64 -P micro
```

## Step 5: Confirm success criteria

The run is considered successful when:

1. Both matrix jobs complete successfully (`node-version: 22` and `node-version: 24`).
2. `Run build` succeeds.
3. `Run tests` succeeds.
4. Final output includes job success (for example, `Job succeeded`).

## Troubleshooting

- If schema errors occur, validate YAML indentation in `.github/workflows/ci.yml`.
- If container start fails, check Docker socket and daemon status.
- If tool binaries fail in the runner image, switch the runner image mapping with `-P`.
- If dependencies fail to install, rerun with network access and no offline mode.

## Reporting format

When reporting results, include:

- The exact command used.
- Whether prerequisites passed (`act`, `docker`).
- Whether each matrix leg passed or failed.
- The first failing step and its key error message (if any).
