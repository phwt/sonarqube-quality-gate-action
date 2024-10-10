import {Context} from "@actions/github/lib/context";
import {QualityGate} from "../models";
import {buildReport} from "../report";
import timezone_mock from "timezone-mock";

jest.useFakeTimers().setSystemTime(new Date("1970-01-01T08:31+00:00"));

const qualityGate: QualityGate = {
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
        periods: [],
        ignoredConditions: false,
    },
};

const context: Context = {
    payload: {key: "any"},
    actor: "me",
    eventName: "pull_request",
    sha: "",
    ref: "",
    workflow: "",
    action: "",
    job: "",
    runNumber: 0,
    runId: 0,
    apiUrl: "",
    serverUrl: "",
    graphqlUrl: "",
    issue: {
        owner: "",
        repo: "",
        number: 0,
    },
    repo: {
        owner: "",
        repo: "",
    },
};

describe("buildReport", () => {
    test("should build report", () => {
        timezone_mock.register("UTC");
        const hostURL = "https://host-url.com/";
        const projectKey = "project-key";

        const report = buildReport(qualityGate, hostURL, projectKey, context);

        const expectedReport = `### SonarQube Quality Gate Result
- **Result**: :exclamation: Error
- Triggered by @me on \`pull_request\`

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
|Reliability rating|:exclamation: Error|4|> 1|
|Security rating|:exclamation: Error|2|> 1|
|Sqale rating|:white_check_mark: OK|1|> 1|
|Blocker violations|:exclamation: Error|53|> 0|
|Critical violations|:exclamation: Error|45|> 0|
|Line coverage|:exclamation: Error|10.10|< 80|
|Major violations|:exclamation: Error|1168|> 0|
|Minor violations|:exclamation: Error|81|> 30|
|New duplicated blocks|:white_check_mark: OK|0|> 0|
|New minor violations|:white_check_mark: OK|0|> 0|

[View on SonarQube](https://host-url.com/dashboard?id=project-key)
###### _updated: 1/1/1970, 08:31:00 (UTC+0)_`;
        expect(report).toBe(expectedReport);
    });

    test("should build report with report link including branch parameter when branch is defined", () => {
        timezone_mock.register("UTC");
        const hostURL = "https://host-url.com/";
        const projectKey = "project-key";
        const branch = "branch-name";

        const report = buildReport(
            qualityGate,
            hostURL,
            projectKey,
            context,
            branch
        );

        const expectedReport = `### SonarQube Quality Gate Result
- **Result**: :exclamation: Error
- **Branch**: \`branch-name\`
- Triggered by @me on \`pull_request\`

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
|Reliability rating|:exclamation: Error|4|> 1|
|Security rating|:exclamation: Error|2|> 1|
|Sqale rating|:white_check_mark: OK|1|> 1|
|Blocker violations|:exclamation: Error|53|> 0|
|Critical violations|:exclamation: Error|45|> 0|
|Line coverage|:exclamation: Error|10.10|< 80|
|Major violations|:exclamation: Error|1168|> 0|
|Minor violations|:exclamation: Error|81|> 30|
|New duplicated blocks|:white_check_mark: OK|0|> 0|
|New minor violations|:white_check_mark: OK|0|> 0|

[View on SonarQube](https://host-url.com/dashboard?id=project-key&branch=branch-name)
###### _updated: 1/1/1970, 08:31:00 (UTC+0)_`;
        expect(report).toBe(expectedReport);
    });

    test("should build report with report link including pull request parameter when pullrequest is defined", () => {
        timezone_mock.register("UTC");
        const hostURL = "https://host-url.com/";
        const projectKey = "project-key";
        const pullRequest = "12";

        const report = buildReport(
            qualityGate,
            hostURL,
            projectKey,
            context,
            undefined,
            pullRequest
        );

        const expectedReport = `### SonarQube Quality Gate Result
- **Result**: :exclamation: Error
- **PR**: \`12\`
- Triggered by @me on \`pull_request\`

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
|Reliability rating|:exclamation: Error|4|> 1|
|Security rating|:exclamation: Error|2|> 1|
|Sqale rating|:white_check_mark: OK|1|> 1|
|Blocker violations|:exclamation: Error|53|> 0|
|Critical violations|:exclamation: Error|45|> 0|
|Line coverage|:exclamation: Error|10.10|< 80|
|Major violations|:exclamation: Error|1168|> 0|
|Minor violations|:exclamation: Error|81|> 30|
|New duplicated blocks|:white_check_mark: OK|0|> 0|
|New minor violations|:white_check_mark: OK|0|> 0|

[View on SonarQube](https://host-url.com/dashboard?id=project-key&pullRequest=12)
###### _updated: 1/1/1970, 08:31:00 (UTC+0)_`;
        expect(report).toBe(expectedReport);
    });
});
