# SonarQube Quality Gate Check

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

