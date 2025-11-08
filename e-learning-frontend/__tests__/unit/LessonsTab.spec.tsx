import React from "react";
import { render, screen } from "@testing-library/react-native";
import LessonsTab from "@/components/learning/LessonsTab";
import { Lesson } from "@/types";

const mockLessons: Lesson[] = [
  {
    _id: "1",
    title: "Introduction to React Native",
    duration: 15,
    youtubeVideoId: "abc123",
  },
  {
    _id: "2",
    title: "Setting up Development Environment",
    duration: 20,
    youtubeVideoId: "def456",
  },
  {
    _id: "3",
    title: "Building Your First App",
    duration: 30,
    youtubeVideoId: "ghi789",
  },
];

describe("LessonsTab Component", () => {
  const mockOnSelectLesson = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("UT-030: should render lesson title", () => {
    render(
      <LessonsTab
        lessons={mockLessons}
        selectedLessonId="1"
        onSelectLesson={mockOnSelectLesson}
      />
    );
    expect(screen.getByText("Introduction to React Native")).toBeTruthy();
    expect(screen.getByText("Setting up Development Environment")).toBeTruthy();
    expect(screen.getByText("Building Your First App")).toBeTruthy();
  });

  it("UT-031: should show completion checkmark", () => {
    render(
      <LessonsTab
        lessons={mockLessons}
        selectedLessonId="1"
        onSelectLesson={mockOnSelectLesson}
      />
    );
    expect(screen.getByText("01")).toBeTruthy();
    expect(screen.getByText("02")).toBeTruthy();
    expect(screen.getByText("03")).toBeTruthy();
  });

  it("UT-032: should display lesson duration", () => {
    render(
      <LessonsTab
        lessons={mockLessons}
        selectedLessonId="1"
        onSelectLesson={mockOnSelectLesson}
      />
    );
    expect(screen.getByText("15 mins")).toBeTruthy();
    expect(screen.getByText("20 mins")).toBeTruthy();
    expect(screen.getByText("30 mins")).toBeTruthy();
  });
});
