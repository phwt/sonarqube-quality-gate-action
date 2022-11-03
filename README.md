# SonarQube Quality Gate Check

Check quality gate result from latest analysis and report result in the pull request's comment.

![PR comment](https://user-images.githubusercontent.com/28344318/194283898-6f3f6466-d4a7-4f83-93a4-daef88b14777.png)

## Inputs

<!-- start inputs -->

| **Input**               | **Description**                                                                                                                       | **Default** | **Required** |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| **`sonar-project-key`** | SonarQube project key                                                                                                                 |             | **true**     |
| **`sonar-host-url`**    | SonarQube server URL                                                                                                                  |             | **true**     |
| **`sonar-token`**       | SonarQube token for retrieving quality gate result                                                                                    |             | **true**     |
| **`github-token`**      | GitHub Token for commenting on the pull request - not required if `disable-pr-comment` is set to `true`                               |             | **false**    |
| **`output-type`**       | Share the report as a comment or in the PR description, or disable altogether. Accepts `'comment'`, `'description'`, or `'disabled'`. | `comment`   | **false**    |

<!-- end inputs -->

## Outputs

<!-- start outputs -->

| **Output**            | **Description**                                           |
| --------------------- | --------------------------------------------------------- |
| `project-status`      | Project's quality gate status either as `OK` or `ERROR`   |
| `quality-gate-result` | Quality gate result of the latest analysis in JSON format |

<!-- end outputs -->

## Usage example

```yml
name: Check quality gate result on pull request

on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: phwt/sonarqube-quality-gate-action@v1
        id: quality-gate-check
        with:
          sonar-project-key: ${{ secrets.SONAR_PROJECT_KEY }}
          sonar-host-url: ${{ secrets.SONAR_HOST_URL }}
          sonar-token: ${{ secrets.SONAR_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}

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

      - uses: phwt/sonarqube-quality-gate-action@v1
        id: quality-gate-check
        with:
          sonar-project-key: ${{ secrets.SONAR_PROJECT_KEY }}
          sonar-host-url: ${{ secrets.SONAR_HOST_URL }}
          sonar-token: ${{ secrets.SONAR_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Output result
        run: |
          echo "${{ steps.quality-gate-check.outputs.project-status }}"
          echo "${{ steps.quality-gate-check.outputs.quality-gate-result }}"
```
