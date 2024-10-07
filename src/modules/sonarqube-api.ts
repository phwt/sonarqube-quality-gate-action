import axios from "axios";
import { QualityGate } from "./models";

export const fetchQualityGate = async (
  url: string,
  projectKey: string,
  token: string,
  branch?: string,
  pullRequest?: string
): Promise<QualityGate> => {
  // Only include `branch` or `pullRequest` in the params object if they are defined
  const params = {
    projectKey,
    ...(branch && { branch }),
    ...(pullRequest && { pullRequest }),
  };

  const response = await axios.get<QualityGate>(
    `${url}/api/qualitygates/project_status`,
    {
      params,
      auth: {
        username: token,
        password: "",
      },
    }
  );

  return response.data;
};
