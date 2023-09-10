import axios from "axios";
import { QualityGate } from "./models";

export const fetchQualityGateWithBranch = async (
  url: string,
  projectKey: string,
  branch: string,
  token: string
): Promise<QualityGate> => {
  const response = await axios.get<QualityGate>(
    `${url}/api/qualitygates/project_status`,
    {
      params: {
        projectKey,
        branch,
      },
      auth: {
        username: token,
        password: "",
      },
    }
  );

  return response.data;
};

export const fetchQualityGate = async (
  url: string,
  projectKey: string,
  token: string
): Promise<QualityGate> => {
  const response = await axios.get<QualityGate>(
    `${url}/api/qualitygates/project_status`,
    {
      params: {
        projectKey,
      },
      auth: {
        username: token,
        password: "",
      },
    }
  );

  return response.data;
};