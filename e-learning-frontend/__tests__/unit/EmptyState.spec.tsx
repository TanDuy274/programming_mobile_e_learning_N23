import React from "react";
import { render, screen } from "@testing-library/react-native";
import EmptyState from "@/components/EmptyState";

describe("EmptyState component", () => {
  it("UT-021: should display empty message", () => {
    render(
      <EmptyState icon="search-circle-outline" message="No results found" />
    );
    expect(screen.getByText("No results found")).toBeTruthy();
  });
});
