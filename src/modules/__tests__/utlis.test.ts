import { getStatusEmoji } from "../utils";

describe("getStatusEmoji", () => {
  test("should return check mark with OK when status is `OK`", () => {
    expect(getStatusEmoji("OK")).toBe(":white_check_mark: OK");
  });
});
