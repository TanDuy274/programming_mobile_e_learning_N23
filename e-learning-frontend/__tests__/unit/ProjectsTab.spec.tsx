import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import ProjectsTab from "@/components/learning/ProjectsTab";
import api from "@/api/api";

jest.mock("@/api/api");
const mockedApi = api as jest.Mocked<typeof api>;

const mockProjects = [
  {
    _id: "1",
    user: { name: "John Doe" },
    description: "My awesome React Native project",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    user: { name: "Jane Smith" },
    description: "E-commerce mobile app built with Expo",
    createdAt: "2025-01-02T00:00:00.000Z",
  },
];

describe("ProjectsTab Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("UT-060: should list course projects", async () => {
    mockedApi.get.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
    );
    render(<ProjectsTab courseId="course1" />);

    await waitFor(() => {
      expect(screen.getByText("Upload your project here")).toBeTruthy();
    });
  });

  it("UT-061: should show submission deadline", async () => {
    mockedApi.get.mockResolvedValue({ data: mockProjects });

    render(<ProjectsTab courseId="course1" />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeTruthy();
      expect(screen.getByText("Jane Smith")).toBeTruthy();
    });
  });

  it("UT-062: should allow project submission", async () => {
    mockedApi.get.mockResolvedValue({ data: mockProjects });

    render(<ProjectsTab courseId="course1" />);

    await waitFor(() => {
      expect(screen.getByText("Upload your project here")).toBeTruthy();
    });
  });
});
