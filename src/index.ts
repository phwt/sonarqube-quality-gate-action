import * as core from "@actions/core";
import * as github from "@actions/github";
import { buildReport, reportRegex } from "./modules/report";
import { ActionInputs, OutputType } from "./modules/models";
import { fetchQualityGate } from "./modules/sonarqube-api";
import { trimTrailingSlash } from "./modules/utils";

(async () => {
  try {
    const inputs: ActionInputs = {
      hostURL: trimTrailingSlash(core.getInput("sonar-host-url")),
      projectKey: core.getInput("sonar-project-key"),
      token: core.getInput("sonar-token"),
      outputType: (core.getInput("output-type") as OutputType) ?? "comment",
      githubToken: core.getInput("github-token"),
    };

    const result = await fetchQualityGate(
      inputs.hostURL,
      inputs.projectKey,
      inputs.token
    );

    core.setOutput("project-status", result.projectStatus.status);
    core.setOutput("quality-gate-result", JSON.stringify(result));

    const isPR = github.context.eventName == "pull_request";

    if (isPR && inputs.outputType !== "disabled") {
      if (!inputs.githubToken) {
        throw new Error(
          "`inputs.github-token` is required for result comment creation."
        );
      }

      const { context } = github;
      const octokit = github.getOctokit(inputs.githubToken);

      const reportBody = buildReport(
        result,
        inputs.hostURL,
        inputs.projectKey,
        context
      );

      if (inputs.outputType === "description") {
        const issue = await octokit.rest.issues.get({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number,
        });

        const updatedBody =
          issue.data.body && reportRegex.test(issue.data.body)
            ? issue.data.body.replace(reportRegex, reportBody)
            : reportBody;

        await octokit.rest.issues.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number,
          body: updatedBody,
        });
      } else {
        await octokit.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number,
          body: reportBody,
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("Unexpected error");
    }
  }
})();
