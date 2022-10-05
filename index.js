const core = require("@actions/core");
const github = require("@actions/github");

const getStatusEmoji = (status) => {
  switch (status) {
    case "OK":
      return "🟢 OK";
    case "ERROR":
      return "🔴 Error";
    case "WARN":
      return "🟡 Warning";
    default: // "NONE" and others
      return "";
  }
};

const getComparatorSymbol = (comparator) => {
  switch (comparator) {
    case "GT":
      return ">";
    case "LT":
      return "<";
    default:
      return "";
  }
};

const formatMetricKey = (string) => {
  const replacedString = string.replace(/_/g, " ");
  return replacedString.charAt(0).toUpperCase() + replacedString.slice(1);
};

try {
  const result = {}; // TODO: Fetch result from API

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

    const output = `### SonarQube Quality Gate Result 
- Result: ${getStatusEmoji(result.projectStatus.status)}
- Triggered by @${github.context.actor} on \`${github.context.event_name}\`

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
${resultTable}
[View on SonarQube](${sonar.hostUrl}dashboard?id=${sonar.projectKey})`;

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
  core.setFailed(error.message);
}
