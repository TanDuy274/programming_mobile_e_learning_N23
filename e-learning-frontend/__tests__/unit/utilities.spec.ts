// Utility functions for testing UT-076 to UT-081

// UT-076: formatDate
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

// UT-077 & UT-078: validateEmail
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// UT-079: calculateProgress
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// UT-080: truncateText
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// UT-081: generateSlug
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

describe("Utility Functions - UT-076 to UT-081", () => {
  describe("formatDate", () => {
    it("UT-076: should format date correctly", () => {
      const input = "2025-11-07T10:00:00.000Z";
      const output = formatDate(input);
      expect(output).toMatch(/Nov 7, 2025/);
    });
  });

  describe("validateEmail", () => {
    it("UT-077: should validate correct email", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("test.user@domain.co.uk")).toBe(true);
    });

    it("UT-078: should reject invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("missing@domain")).toBe(false);
      expect(validateEmail("@nodomain.com")).toBe(false);
    });
  });

  describe("calculateProgress", () => {
    it("UT-079: should calculate completion percentage", () => {
      expect(calculateProgress(8, 10)).toBe(80);
      expect(calculateProgress(5, 10)).toBe(50);
      expect(calculateProgress(0, 10)).toBe(0);
      expect(calculateProgress(10, 10)).toBe(100);
    });
  });

  describe("truncateText", () => {
    it("UT-080: should truncate long text", () => {
      const longText = "Very long text that needs truncation";
      expect(truncateText(longText, 10)).toBe("Very long ...");
      expect(truncateText("Short", 10)).toBe("Short");
      expect(truncateText("Exactly 10", 10)).toBe("Exactly 10");
    });
  });

  describe("generateSlug", () => {
    it("UT-081: should create URL-friendly slug", () => {
      expect(generateSlug("React Native Course")).toBe("react-native-course");
      expect(generateSlug("Node.js Backend")).toBe("nodejs-backend");
      expect(generateSlug("  Spaces & Special @#$ Characters  ")).toBe(
        "spaces-special-characters"
      );
    });
  });
});
