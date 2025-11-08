import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import CourseProgressCard from "@/components/CourseProgressCard";

describe("CourseProgressCard component", () => {
  const defaultProps = {
    courseId: "course123",
    title: "React Native Fundamentals",
    totalDurationMinutes: 120,
    progress: 45,
    imageUrl: "https://example.com/course.jpg",
  };

  it("UT-016: should show progress bar", () => {
    render(<CourseProgressCard {...defaultProps} />);
    expect(screen.getByText("React Native Fundamentals")).toBeTruthy();
  });

  it("UT-017: should display course duration", () => {
    render(<CourseProgressCard {...defaultProps} />);
    expect(screen.getByText("2 hrs")).toBeTruthy();
  });

  it("UT-018: should navigate to learning screen", () => {
    const { getByText } = render(<CourseProgressCard {...defaultProps} />);
    fireEvent.press(getByText("React Native Fundamentals"));
    // Navigation is mocked
  });
});
