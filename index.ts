import * as core from "@actions/core";
import * as github from "@actions/github";

const getStatusEmoji = (status) => {
  switch (status) {
    case "OK":
      return ":white_check_mark: OK";
    case "ERROR":
      return ":exclamation:Error";
    case "WARN":
      return ":warning: Warning";
    default: // "NONE" and others
      return ":grey_question:";
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
  const result = {
    projectStatus: {
      status: "ERROR",
      conditions: [
        {
          status: "ERROR",
          metricKey: "reliability_rating",
          comparator: "GT",
          errorThreshold: "1",
          actualValue: "4",
        },
        {
          status: "ERROR",
          metricKey: "security_rating",
          comparator: "GT",
          errorThreshold: "1",
          actualValue: "2",
        },
        {
          status: "OK",
          metricKey: "sqale_rating",
          comparator: "GT",
          errorThreshold: "1",
          actualValue: "1",
        },
        {
          status: "ERROR",
          metricKey: "blocker_violations",
          comparator: "GT",
          errorThreshold: "0",
          actualValue: "53",
        },
        {
          status: "ERROR",
          metricKey: "critical_violations",
          comparator: "GT",
          errorThreshold: "0",
          actualValue: "45",
        },
        {
          status: "ERROR",
          metricKey: "line_coverage",
          comparator: "LT",
          errorThreshold: "80",
          actualValue: "10.1",
        },
        {
          status: "ERROR",
          metricKey: "major_violations",
          comparator: "GT",
          errorThreshold: "0",
          actualValue: "1168",
        },
        {
          status: "ERROR",
          metricKey: "minor_violations",
          comparator: "GT",
          errorThreshold: "30",
          actualValue: "81",
        },
        {
          status: "OK",
          metricKey: "new_duplicated_blocks",
          comparator: "GT",
          periodIndex: 1,
          errorThreshold: "0",
          actualValue: "0",
        },
        {
          status: "OK",
          metricKey: "new_minor_violations",
          comparator: "GT",
          periodIndex: 1,
          errorThreshold: "0",
          actualValue: "0",
        },
      ],
      periods: [
        {
          index: 1,
          mode: "previous_version",
          date: "2022-10-05T08:07:36+0000",
          parameter: "GITHUB-RUN-3188221854-43",
        },
      ],
      ignoredConditions: false,
    },
  }; // TODO: Fetch result from API

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
