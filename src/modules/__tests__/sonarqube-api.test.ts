import axios from "axios";
import { fetchQualityGate } from "../sonarqube-api";

jest.mock("axios");

describe("fetchQualityGate", () => {
  it("should make a GET request to the correct URL with only `projectKey` parameter when only `projectKey` is defined", async () => {
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

  it("should make a GET request to the correct URL with `projectKey` and `branch` parameter when `branch` is defined", async () => {
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

  it("should make a GET request to the correct URL with `projectKey` and `pullRequest` parameter when `pullRequest` is defined", async () => {
    (axios.get as jest.Mock).mockResolvedValue({});

    await fetchQualityGate(
      "https://example.com",
      "key",
      "token",
      undefined,
      "pull-request"
    );

    expect(axios.get).toHaveBeenCalledWith(
      `https://example.com/api/qualitygates/project_status`,
      {
        params: { projectKey: "key", pullRequest: "pull-request" },
        auth: { username: "token", password: "" },
      }
    );
  });

  it("should thrown an error when both `branch` and `pullRequest` are defined", async () => {
    (axios.get as jest.Mock).mockResolvedValue({});

    const fetchQualityGateFunction = async () => {
      await fetchQualityGate(
        "https://example.com",
        "key",
        "token",
        "branch",
        "pull-request"
      );
    };

    await expect(fetchQualityGateFunction).rejects.toThrow();
    expect(axios.get).not.toHaveBeenCalled();
  });
});
