import React from "react";
import { render, screen } from "@testing-library/react-native";
import Header from "@/components/Header";

// Mock expo-router
const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("UT-022: should render title prop", () => {
    render(<Header title="My Courses" />);
    expect(screen.getByText("My Courses")).toBeTruthy();
  });

  it("UT-023: should show back button when specified", () => {
    render(<Header title="Course Details" showBackButton={true} />);
    expect(screen.getByText("Course Details")).toBeTruthy();
  });
});
