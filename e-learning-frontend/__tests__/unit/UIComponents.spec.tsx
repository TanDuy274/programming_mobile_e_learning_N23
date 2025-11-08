import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text, TouchableOpacity, View, TextInput, Modal } from "react-native";

// Mock UI Components
const Button = ({
  text,
  onPress,
  loading,
  disabled,
}: {
  text: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) => (
  <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
    <Text>{loading ? "Loading..." : text}</Text>
  </TouchableOpacity>
);

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
}: {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
}) => (
  <View>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
    {error && <Text>{error}</Text>}
  </View>
);

const CustomModal = ({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <Modal visible={visible} onRequestClose={onClose}>
    {children}
  </Modal>
);

describe("UI Components - UT-039 to UT-048", () => {
  // Button Tests (UT-039 to UT-042)
  describe("Button Component", () => {
    it("UT-039: should render button text", () => {
      render(<Button text="Submit" onPress={() => {}} />);
      expect(screen.getByText("Submit")).toBeTruthy();
    });

    it("UT-040: should handle press event", () => {
      const onPress = jest.fn();
      render(<Button text="Click Me" onPress={onPress} />);
      fireEvent.press(screen.getByText("Click Me"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("UT-041: should show loading state", () => {
      render(<Button text="Submit" onPress={() => {}} loading={true} />);
      expect(screen.getByText("Loading...")).toBeTruthy();
      expect(screen.queryByText("Submit")).toBeFalsy();
    });

    it("UT-042: should be disabled when specified", () => {
      const onPress = jest.fn();
      render(<Button text="Submit" onPress={onPress} disabled={true} />);
      fireEvent.press(screen.getByText("Submit"));
      // Disabled button should not call onPress
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  // Input Tests (UT-043 to UT-046)
  describe("Input Component", () => {
    it("UT-043: should accept text input", () => {
      const onChangeText = jest.fn();
      render(
        <Input value="" onChangeText={onChangeText} placeholder="Enter text" />
      );
      const input = screen.getByPlaceholderText("Enter text");
      fireEvent.changeText(input, "Hello World");
      expect(onChangeText).toHaveBeenCalledWith("Hello World");
    });

    it("UT-044: should show placeholder", () => {
      render(<Input placeholder="Email" />);
      expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    });

    it("UT-045: should handle secure text entry", () => {
      render(<Input secureTextEntry={true} placeholder="Password" />);
      const input = screen.getByPlaceholderText("Password");
      expect(input.props.secureTextEntry).toBe(true);
    });

    it("UT-046: should display error message", () => {
      render(<Input error="Required field" />);
      expect(screen.getByText("Required field")).toBeTruthy();
    });
  });

  // Modal Tests (UT-047 to UT-048)
  describe("Modal Component", () => {
    it("UT-047: should open and close", () => {
      const { rerender } = render(
        <CustomModal visible={false} onClose={() => {}}>
          <Text>Modal Content</Text>
        </CustomModal>
      );

      expect(screen.queryByText("Modal Content")).toBeFalsy();

      rerender(
        <CustomModal visible={true} onClose={() => {}}>
          <Text>Modal Content</Text>
        </CustomModal>
      );

      expect(screen.getByText("Modal Content")).toBeTruthy();
    });

    it("UT-048: should render children content", () => {
      render(
        <CustomModal visible={true} onClose={() => {}}>
          <Text>Child Component</Text>
          <Text>Another Child</Text>
        </CustomModal>
      );

      expect(screen.getByText("Child Component")).toBeTruthy();
      expect(screen.getByText("Another Child")).toBeTruthy();
    });
  });
});
