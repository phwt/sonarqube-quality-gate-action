import * as core from "@actions/core";
import * as github from "@actions/github";
import { ActionInputs } from "./modules/models";
import { commentResult } from "./modules/comment";
import { addSummary } from "./modules/summary";
import { fetchQualityGate } from "./modules/sonarqube-api";
import { trimTrailingSlash } from "./modules/utils";

(async () => {
  try {
    const inputs: ActionInputs = {
      hostURL: trimTrailingSlash(core.getInput("sonar-host-url")),
      projectKey: core.getInput("sonar-project-key"),
      token: core.getInput("sonar-token"),
      commentDisabled: core.getInput("disable-pr-comment") === "true",
      stepSummaryDisabled: core.getInput("disable-step-summary") === "true",
      failOnQualityGateError:
        core.getInput("fail-on-quality-gate-error") === "true",
      branch: core.getInput("branch"),
      pullRequest: core.getInput("pull-request"),
      githubToken: core.getInput("github-token"),
    };

    const result = await fetchQualityGate(
      inputs.hostURL,
      inputs.projectKey,
      inputs.token,
      inputs.branch,
      inputs.pullRequest
    );

    core.setOutput("project-status", result.projectStatus.status);
    core.setOutput("quality-gate-result", JSON.stringify(result));

    const isPR = github.context.eventName == "pull_request";
    if (isPR && !inputs.commentDisabled) {
      await commentResult({ inputs, result, github });
    }

    if (!inputs.stepSummaryDisabled) {
      console.log("Adding report to the step summary...");
      await addSummary({ inputs, result, github });
    }

    let resultMessage = `Quality gate status for \`${inputs.projectKey}\` returned \`${result.projectStatus.status}\``;
    if (
      inputs.failOnQualityGateError &&
      result.projectStatus.status === "ERROR"
    ) {
      console.error(resultMessage);
      core.setFailed(resultMessage);
    } else {
      console.log(resultMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      core.setFailed(error.message);
    } else {
      console.error("Unexpected error");
      core.setFailed("Unexpected error");
    }
  }
})();
