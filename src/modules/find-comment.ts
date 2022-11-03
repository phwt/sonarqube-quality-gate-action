import * as github from "@actions/github";

interface Inputs {
  token: string;
  repository: string;
  issueNumber: number;
  commentAuthor: string;
  bodyIncludes: string;
  direction: string;
}

interface Comment {
  id: number;
  body?: string;
  user: {
    login: string;
  } | null;
}

function findCommentPredicate(inputs: Inputs, comment: Comment): boolean {
  return (
    (inputs.commentAuthor && comment.user
      ? comment.user.login === inputs.commentAuthor
      : true) &&
    (inputs.bodyIncludes && comment.body
      ? comment.body.includes(inputs.bodyIncludes)
      : true)
  );
}

export async function findComment(inputs: Inputs): Promise<Comment | undefined> {
  const octokit = github.getOctokit(inputs.token);
  const [owner, repo] = inputs.repository.split("/");

  const parameters = {
    owner: owner,
    repo: repo,
    issue_number: inputs.issueNumber,
  };

  if (inputs.direction == "first") {
    for await (const { data: comments } of octokit.paginate.iterator(
      octokit.rest.issues.listComments,
      parameters
    )) {
      // Search each page for the comment
      const comment = comments.find((comment) =>
        findCommentPredicate(inputs, comment)
      );
      if (comment) return comment;
    }
  } else {
    // direction == 'last'
    const comments = await octokit.paginate(
      octokit.rest.issues.listComments,
      parameters
    );
    comments.reverse();
    const comment = comments.find((comment) =>
      findCommentPredicate(inputs, comment)
    );
    if (comment) return comment;
  }
  return undefined;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
