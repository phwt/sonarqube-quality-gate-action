import { ActionInputs, QualityGate } from "./models";
import { buildReport } from "./report";
import { findComment } from "./find-comment/main";

export const commentResult = async ({
  inputs,
  result,
  github,
}: {
  inputs: ActionInputs;
  result: QualityGate;
  github: typeof import("@actions/github");
}) => {
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
    context,
    inputs.branch,
    inputs.pullRequest
  );

  console.log("Finding comment associated with the report...");

  const githubUsername = await (async () => {
    try {
      return (await octokit.rest.users.getAuthenticated()).data.login;
    } catch {
      console.warn(
        "Unable to determine the user, defaulting to 'github-actions[bot]'"
      );
      return "github-actions[bot]";
    }
  })();

  console.log(`Authenticated as GitHub user: ${githubUsername}`);

  const issueComment = await findComment({
    token: inputs.githubToken,
    repository: `${context.repo.owner}/${context.repo.repo}`,
    issueNumber: context.issue.number,
    commentAuthor: githubUsername,
    bodyIncludes: "SonarQube Quality Gate Result",
    direction: "first",
  });

  if (issueComment) {
    console.log("Found existing comment, updating with the latest report.");

    await octokit.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      comment_id: issueComment.id,
      body: reportBody,
    });
  } else {
    console.log("Report comment does not exist, creating a new one.");

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: reportBody,
    });
  }
};
