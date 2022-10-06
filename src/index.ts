import * as core from "@actions/core";
import * as github from "@actions/github";
import { buildComment } from "./modules/comment";
import { fetchQualityGate } from "./modules/sonarqube-api";
import {
  formatMetricKey,
  getStatusEmoji,
  getComparatorSymbol,
  trimTrailingSlash,
} from "./modules/utils";

(async () => {
  try {
    const hostURL = trimTrailingSlash(core.getInput("sonar-host-url"));
    const projectKey = core.getInput("sonar-project-key");

    const result = await fetchQualityGate(
      hostURL,
      projectKey,
      core.getInput("sonar-token")
    );

    // TODO: Output result

    const commentDisabled = core.getInput("disable-pr-comment") == "true";
    const isPR = github.context.eventName == "pull_request";

    if (isPR && !commentDisabled) {
      const token = core.getInput("github-token");
      const octokit = github.getOctokit(token);

      octokit.rest.issues.createComment({
        issue_number: github.context.issue.number,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        body: buildComment(result, hostURL, projectKey, github.context),
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("Unexpected error");
    }
  }
})();
