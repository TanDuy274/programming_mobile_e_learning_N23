import { formatDuration } from "@/utils/formatDuration";

describe("formatDuration utility", () => {
  it("UT-074: should format minutes to hours", () => {
    expect(formatDuration(125)).toBe("2 hrs 5 mins");
    expect(formatDuration(90)).toBe("1 hrs 30 mins");
    expect(formatDuration(60)).toBe("1 hrs");
    expect(formatDuration(45)).toBe("45 mins");
  });

  it("UT-075: should handle zero duration", () => {
    expect(formatDuration(0)).toBe("N/A");
    expect(formatDuration(-10)).toBe("N/A");
  });
});
