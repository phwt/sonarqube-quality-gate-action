import * as core from "@actions/core";
import * as github from "@actions/github";
import { buildComment } from "./modules/comment";
import { ActionInputs } from "./modules/models";
import { fetchQualityGate } from "./modules/sonarqube-api";
import { trimTrailingSlash } from "./modules/utils";

(async () => {
  try {
    const inputs: ActionInputs = {
      hostURL: trimTrailingSlash(core.getInput("sonar-host-url")),
      projectKey: core.getInput("sonar-project-key"),
      token: core.getInput("sonar-token"),
      commentDisabled: core.getInput("disable-pr-comment") == "true",
      githubToken: core.getInput("github-token"),
    };

    const result = await fetchQualityGate(
      inputs.hostURL,
      inputs.projectKey,
      inputs.token
    );

    // TODO: Output result

    const isPR = github.context.eventName == "pull_request";

    if (isPR && !inputs.commentDisabled) {
      if (!inputs.githubToken) {
        throw new Error(
          "`inputs.github-token` is required for result comment creation."
        );
      }

      const { context } = github;
      const octokit = github.getOctokit(inputs.githubToken);

      await octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: buildComment(result, inputs.hostURL, inputs.projectKey, context),
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
