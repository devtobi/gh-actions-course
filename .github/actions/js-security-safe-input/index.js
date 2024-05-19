const core = require("@actions/core");

async function run() {
  // get input
  const prTitle = core.getInput("pr-title", { required: true });
  if (prTitle.startsWith("feat")) {
    core.info("PR is a feature");
  } else {
    core.setFailed("PR is not a feature");
  }
}

run();
