import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import CategoryListItem from "@/components/CategoryListItem";

describe("CategoryListItem component", () => {
  const defaultProps = {
    iconName: "code-slash-outline" as const,
    categoryName: "Programming",
    color: "#3498db",
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("UT-009: should render category item in list", () => {
    render(<CategoryListItem {...defaultProps} />);
    expect(screen.getByText("Programming")).toBeTruthy();
  });

  it("UT-010: should navigate on press", () => {
    const onPress = jest.fn();
    render(<CategoryListItem {...defaultProps} onPress={onPress} />);

    fireEvent.press(screen.getByText("Programming"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
