import React from "react";
import { render, screen } from "@testing-library/react-native";
import { SuccessToast, ErrorToast } from "@/components/CustomToast";

describe("CustomToast Components", () => {
  describe("SuccessToast", () => {
    it("UT-019: should render success toast", () => {
      render(
        <SuccessToast
          text1="Success"
          text2="Operation completed successfully"
          onPress={jest.fn()}
        />
      );
      expect(screen.getByText("Success")).toBeTruthy();
      expect(screen.getByText("Operation completed successfully")).toBeTruthy();
    });
  });

  describe("ErrorToast", () => {
    it("UT-020: should render error toast", () => {
      render(
        <ErrorToast
          text1="Error"
          text2="Something went wrong"
          onPress={jest.fn()}
        />
      );
      expect(screen.getByText("Error")).toBeTruthy();
      expect(screen.getByText("Something went wrong")).toBeTruthy();
    });
  });
});
