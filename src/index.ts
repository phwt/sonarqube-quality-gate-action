import * as core from "@actions/core";
import * as github from "@actions/github";
import { fetchQualityGate } from "./sq-api";
import { formatMetricKey, getStatusEmoji, getComparatorSymbol } from "./utils";

(async () => {
  try {
    const result = await fetchQualityGate(
      core.getInput("sonar-host-url"),
      core.getInput("sonar-project-key"),
      core.getInput("sonar-token")
    );

    // TODO: Output result

    const commentDisabled = core.getInput("disable-pr-comment") == "true";
    const isPR = github.context.eventName == "pull_request";

    if (isPR && !commentDisabled) {
      const resultTable = result.projectStatus.conditions
        .map((condition) => {
          const tableValues = [
            formatMetricKey(condition.metricKey),
            getStatusEmoji(condition.status),
            condition.actualValue,
            `${getComparatorSymbol(condition.comparator)} ${
              condition.errorThreshold
            }`,
          ];

          return `|${tableValues.join("|")}|`;
        })
        .join("\n");

      const projectKey = core.getInput("sonar-project-key");
      const hostURL = core.getInput("sonar-host-url");

      const output = `### SonarQube Quality Gate Result 
- **Result**: ${getStatusEmoji(result.projectStatus.status)}
- Triggered by @${github.context.actor} on \`${github.context.eventName}\`

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
${resultTable}

[View on SonarQube](${hostURL}/dashboard?id=${projectKey})`;

      const token = core.getInput("github-token");
      const octokit = github.getOctokit(token);

      octokit.rest.issues.createComment({
        issue_number: github.context.issue.number,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        body: output,
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
