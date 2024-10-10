# SonarQube Quality Gate Check

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=sonarqube-quality-gate-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=sonarqube-quality-gate-action)

Check quality gate result from latest analysis and report result in the pull request's comment.

![PR comment](https://user-images.githubusercontent.com/28344318/194283898-6f3f6466-d4a7-4f83-93a4-daef88b14777.png)

<!-- Generated with `npx action-docs --update-readme` -->

<!-- action-docs-inputs -->

## Inputs

| parameter                  | description                                                                                             | required | default |
| -------------------------- | ------------------------------------------------------------------------------------------------------- | -------- | ------- |
| sonar-project-key          | SonarQube project key                                                                                   | `true`   |         |
| sonar-host-url             | SonarQube server URL                                                                                    | `true`   |         |
| sonar-token                | SonarQube token for retrieving quality gate result                                                      | `true`   |         |
| github-token               | GitHub Token for commenting on the pull request - not required if `disable-pr-comment` is set to `true` | `false`  |         |
| disable-pr-comment         | Disable commenting result on the pull request                                                           | `false`  | false   |
| fail-on-quality-gate-error | Set the action status to failed when quality gate status is `ERROR`                                     | `false`  | false   |
| branch                     | Branch name to retrieve the quality gate result, mutually exclusive with `pull-request` input           | `false`  |         |
| pull-request               | Pull request id to retrieve the quality gate result, mutually exclusive with `branch` input             | `false`  |         |

<!-- action-docs-inputs -->

<!-- action-docs-outputs -->

## Outputs

| parameter           | description                                             |
| ------------------- | ------------------------------------------------------- |
| project-status      | Project's quality gate status either as `OK` or `ERROR` |
| quality-gate-result | Quality gate of the latest analysis in JSON format      |

<!-- action-docs-outputs -->

## Usage example

```yml
name: Check quality gate result on pull request

on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: S1riU5/sonarqube-quality-gate-action@v1
        id: quality-gate-check
        with:
          sonar-project-key: ${{ secrets.SONAR_PROJECT_KEY }}
          sonar-host-url: ${{ secrets.SONAR_HOST_URL }}
          sonar-token: ${{ secrets.SONAR_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          branch: main # Optional input, mutually exclusive with `pull-request`
          pull-request: 8 # Optional input, mutually exclusive with `branch`

      - name: Output result
        run: |
          echo "${{ steps.quality-gate-check.outputs.project-status }}"
          echo "${{ steps.quality-gate-check.outputs.quality-gate-result }}"
```

### Check the results immediately after the scan

Sometimes the results will not be available right away after the scan has finished.
Make sure to add a defer step before retrieving the scan results.

```yml
name: Check quality gate result on pull request

on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: some/scan-actions@v1 # Step for scanning your project

      - name: Wait for the quality gate result
        run: sleep 5

      - uses: S1riU5/sonarqube-quality-gate-action@v1
        id: quality-gate-check
        with:
          sonar-project-key: ${{ secrets.SONAR_PROJECT_KEY }}
          sonar-host-url: ${{ secrets.SONAR_HOST_URL }}
          sonar-token: ${{ secrets.SONAR_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          branch: main # Optional input, mutually exclusive with `pull-request`
          pull-request: 8 # Optional input, mutually exclusive with `branch`

      - name: Output result
        run: |
          echo "${{ steps.quality-gate-check.outputs.project-status }}"
          echo "${{ steps.quality-gate-check.outputs.quality-gate-result }}"
```
