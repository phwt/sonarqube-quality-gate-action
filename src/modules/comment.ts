import { Context } from "@actions/github/lib/context";
import { QualityGate } from "./models";
import {
  formatMetricKey,
  getStatusEmoji,
  getComparatorSymbol,
  trimTrailingSlash,
} from "./utils";

export const buildComment = (
  result: QualityGate,
  hostURL: string,
  projectKey: string,
  context: Context
) => {
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

  const projectURL = trimTrailingSlash(hostURL) + `/dashboard?id=${projectKey}`;

  const output = `### SonarQube Quality Gate Result 
- **Result**: ${getStatusEmoji(result.projectStatus.status)}
- Triggered by @${context.actor} on \`${context.eventName}\`

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
${resultTable}

[View on SonarQube](${projectURL})`;

  return output;
};
