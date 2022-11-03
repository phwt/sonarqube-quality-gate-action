import { Context } from "@actions/github/lib/context";
import { Condition, QualityGate } from "./models";
import {
  formatMetricKey,
  getStatusEmoji,
  getComparatorSymbol,
  trimTrailingSlash,
} from "./utils";

const buildRow = (condition: Condition) => {
  const rowValues = [
    formatMetricKey(condition.metricKey), // Metric
    getStatusEmoji(condition.status), // Status
    condition.actualValue, // Value
    `${getComparatorSymbol(condition.comparator)} ${condition.errorThreshold}`, // Error Threshold
  ];

  return "|" + rowValues.join("|") + "|";
};

const startBlock = "<!-- start-report -->";
const endBlock = "<!-- end-report -->";

export const reportBlockRegex = new RegExp(`${startBlock}[\s\S]*${endBlock}`);

export const buildReport = (
  result: QualityGate,
  hostURL: string,
  projectKey: string,
  context: Context
) => {
  const projectURL = trimTrailingSlash(hostURL) + `/dashboard?id=${projectKey}`;
  const projectStatus = getStatusEmoji(result.projectStatus.status);

  const resultTable = result.projectStatus.conditions.map(buildRow).join("\n");

  return `${startBlock}
### SonarQube Quality Gate Result 
- **Result**: ${projectStatus}
- Triggered by @${context.actor} on \`${context.eventName}\`

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
${resultTable}

[View on SonarQube](${projectURL})
###### _(report time: ${result.projectStatus.periods[0].date.toLocaleString()}, updated: ${new Date().toLocaleString()})_
${endBlock}`;
};
