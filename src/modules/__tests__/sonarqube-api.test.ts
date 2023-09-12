import axios from "axios";
import { fetchQualityGate } from "../sonarqube-api";

jest.mock("axios");

describe("fetchQualityGate", () => {
  it("should make a GET request to the correct URL with all parameters when branch is defined", async () => {
    (axios.get as jest.Mock).mockResolvedValue({});

    await fetchQualityGate("https://example.com", "key", "token", "branch");

    expect(axios.get).toHaveBeenCalledWith(
      `https://example.com/api/qualitygates/project_status`,
      {
        params: { projectKey: "key", branch: "branch" },
        auth: { username: "token", password: "" },
      }
    );
  });

  it("should make a GET request to the correct URL with all parameters except branch when branch is not defined", async () => {
    (axios.get as jest.Mock).mockResolvedValue({});

    await fetchQualityGate("https://example.com", "key", "token");

    expect(axios.get).toHaveBeenCalledWith(
      `https://example.com/api/qualitygates/project_status`,
      {
        params: { projectKey: "key" },
        auth: { username: "token", password: "" },
      }
    );
  });
});
