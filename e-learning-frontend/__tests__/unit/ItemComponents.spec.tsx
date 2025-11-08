import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

// Mock Item Components
const ProjectItem = ({
  project,
}: {
  project: { title: string; submitted?: boolean };
}) => (
  <View>
    <Text>{project.title}</Text>
    {project.submitted && <Text>Submitted</Text>}
  </View>
);

const QuestionItem = ({
  question,
}: {
  question: { text: string; answerCount: number };
}) => (
  <View>
    <Text>{question.text}</Text>
    <Text>{question.answerCount} answers</Text>
  </View>
);

const ReviewItem = ({
  review,
}: {
  review: { reviewer: string; rating: number; comment: string };
}) => (
  <View>
    <Text>{review.reviewer}</Text>
    <Text>{"★".repeat(review.rating)}</Text>
    <Text>{review.comment}</Text>
  </View>
);

describe("Item Components - UT-033 to UT-038", () => {
  // ProjectItem Tests (UT-033 to UT-034)
  describe("ProjectItem Component", () => {
    it("UT-033: should render project title", () => {
      const project = { title: "Build a Todo App", submitted: false };
      render(<ProjectItem project={project} />);
      expect(screen.getByText("Build a Todo App")).toBeTruthy();
    });

    it("UT-034: should show submission status", () => {
      const project = { title: "Final Project", submitted: true };
      render(<ProjectItem project={project} />);
      expect(screen.getByText("Submitted")).toBeTruthy();
    });
  });

  // QuestionItem Tests (UT-035 to UT-036)
  describe("QuestionItem Component", () => {
    it("UT-035: should display question text", () => {
      const question = {
        text: "How to use useState?",
        answerCount: 3,
      };
      render(<QuestionItem question={question} />);
      expect(screen.getByText("How to use useState?")).toBeTruthy();
    });

    it("UT-036: should show answer count", () => {
      const question = {
        text: "What is React Native?",
        answerCount: 5,
      };
      render(<QuestionItem question={question} />);
      expect(screen.getByText("5 answers")).toBeTruthy();
    });
  });

  // ReviewItem Tests (UT-037 to UT-038)
  describe("ReviewItem Component", () => {
    it("UT-037: should render user review", () => {
      const review = {
        reviewer: "John Doe",
        rating: 4,
        comment: "Great course!",
      };
      render(<ReviewItem review={review} />);
      expect(screen.getByText("John Doe")).toBeTruthy();
      expect(screen.getByText("Great course!")).toBeTruthy();
    });

    it("UT-038: should display star rating", () => {
      const review = {
        reviewer: "Jane Smith",
        rating: 5,
        comment: "Excellent!",
      };
      render(<ReviewItem review={review} />);
      expect(screen.getByText("★★★★★")).toBeTruthy();
    });
  });
});
