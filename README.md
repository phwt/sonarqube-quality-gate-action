# SonarQube Quality Gate Check

Check quality gate result from latest analysis and report result in the pull request's comment.

## Inputs

<!-- start inputs -->

| **Input**                | **Description**                                                                                         | **Default** | **Required** |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| **`sonar-project-key`**  | SonarQube project key                                                                                   |             | **true**     |
| **`sonar-host-url`**     | SonarQube server URL                                                                                    |             | **true**     |
| **`sonar-token`**        | SonarQube token for retrieving quality gate result                                                      |             | **true**     |
| **`github-token`**       | GitHub Token for commenting on the pull request - not required if `disable-pr-comment` is set to `true` |             | **false**    |
| **`disable-pr-comment`** | Disable commenting result on the pull request                                                           | `false`     | **false**    |

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
      - uses: phwt/sonarqube-quality-gate-action@v0
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
