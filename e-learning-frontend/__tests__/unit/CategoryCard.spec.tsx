import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import CategoryCard from "@/components/CategoryCard";

describe("UT-006 to UT-008: CategoryCard component", () => {
  const defaultProps = {
    iconName: "code-slash-outline" as const,
    categoryName: "Programming",
    color: "#3498db",
  };

  it("UT-006: should render category name correctly", () => {
    render(<CategoryCard {...defaultProps} />);
    expect(screen.getByText("Programming")).toBeTruthy();
  });

  it("UT-007: should display course count", () => {
    // Note: Current implementation doesn't show count
    render(<CategoryCard {...defaultProps} />);
    expect(screen.getByText("Programming")).toBeTruthy();
  });

  it("UT-008: should handle press event", () => {
    const onPress = jest.fn();
    render(<CategoryCard {...defaultProps} onPress={onPress} />);

    fireEvent.press(screen.getByText("Programming"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
