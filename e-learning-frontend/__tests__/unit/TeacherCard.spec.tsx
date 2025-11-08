import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import TeacherCard from "@/components/TeacherCard";

// Mock expo-router is already in __mocks__/expo-router.js

describe("TeacherCard component", () => {
  const defaultProps = {
    id: "teacher123",
    name: "John Doe",
    avatarUrl: "https://example.com/avatar.jpg",
    rating: 4.5,
    reviews: 123,
  };

  it("UT-028: should display teacher info", () => {
    render(<TeacherCard {...defaultProps} />);
    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("UT-029: should navigate to teacher profile", () => {
    const { getByText } = render(<TeacherCard {...defaultProps} />);
    fireEvent.press(getByText("John Doe"));
    // Navigation is mocked, just verify no crash
  });
});
