const core = require("@actions/core");
const exec = require("@actions/exec");

const validateBranchName = (branchName) =>
  /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);
const validateDirName = (dirName) => /^[a-zA-Z0-9_\-\/]+$/.test(dirName);

async function run() {
  /*
  1. Parse Inputs
    1.1 base-branch from which to check for updates
    1.2 target-branch to use to create the PR
    1.3 GitHub token for authentication against GitHub API (to create PRs)
    1.4 Working directory for which to check for dependencies
  2. Execute npm update command within working directory
  3. Check whether there are modified package*.json files
  4. If there are modified files:
    4.1 Add and commit files to the target-branch
    4.2 Create PR to the base-branch using the octokit API
  5. otherwise end the action
  */
  core.info("I am a custom JS action");

  // Extract inputs from action
  const baseBranch = core.getInput("base-branch");
  const targetBranch = core.getInput("target-branch");
  const workingDirectory = core.getInput("working-directory");
  const ghToken = core.getInput("gh-token");
  const debug = core.getBooleanInput("debug");

  // Marks the ghToken input as sensitive
  core.setSecret(ghToken);

  // Check inputs
  if (validateBranchName(baseBranch)) {
    core.setFailed(
      "Invalid base branch. Branch names should include only characters, numbers, hyphens, underscores, dots and forward slashes."
    );
    return;
  }

  if (validateBranchName(targetBranch)) {
    core.setFailed(
      "Invalid target branch. Branch names should include only characters, numbers, hyphens, underscores, dots and forward slashes."
    );
    return;
  }

  if (validateDirName(workingDirectory)) {
    core.setFailed(
      "Invalid working directory name. Directory names should should include only characters, numbers, hyphens, underscores and forward slashes."
    );
    return;
  }

  // Print information
  core.info(`[js-dependency-update]: Base branch is ${baseBranch}`);
  core.info(`[js-dependency-update]: Target branch is ${targetBranch}`);
  core.info(`[js-dependency-update]: Working directory is ${workingDirectory}`);

  // Update dependencies
  await exec.exec("npm update", [], {
    cwd: workingDirectory,
  });

  // Check if changes to package*-files were made
  const gitStatus = await exec.getExecOutput(
    "git status -s package*.json",
    [],
    {
      cwd: workingDirectory,
    }
  );

  if (gitStatus.stdout.length > 0) {
    core.info("[js-dependency-update]: There are updates available!");
  } else {
    core.info("[js-dependency-update]: No updates available.");
  }
}

run();
