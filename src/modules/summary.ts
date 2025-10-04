import { ActionInputs, QualityGate } from "./models";
import { buildReport } from "./report";
import * as fs from "fs";

export const addSummary = async ({
  inputs,
  result,
  github,
}: {
  inputs: ActionInputs;
  result: QualityGate;
  github: typeof import("@actions/github");
}) => {
  const { context } = github;

  const reportBody = buildReport(
    inputs,
    result,
    inputs.hostURL,
    inputs.projectKey,
    context,
    inputs.branch,
    inputs.pullRequest
  );

  console.log("Adding report to the step summary...");
  const summaryFilePath = process.env.GITHUB_STEP_SUMMARY;

  if (!summaryFilePath) throw new Error("GITHUB_STEP_SUMMARY is not defined.");

  try {
    fs.appendFileSync(summaryFilePath, reportBody + "\n");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to write to GITHUB_STEP_SUMMARY: ${error.message}`
      );
    }
  }
};
