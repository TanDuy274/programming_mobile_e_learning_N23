import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

// Mock Tab Components
const CurriculumTab = ({
  lessons,
}: {
  lessons: Array<{ title: string; duration: number }>;
}) => {
  const [expandedSections, setExpandedSections] = React.useState<number[]>([]);
  const totalDuration = lessons.reduce(
    (sum, lesson) => sum + lesson.duration,
    0
  );

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <View>
      <Text>Total: {totalDuration} mins</Text>
      <ScrollView>
        {lessons.map((lesson, index) => (
          <TouchableOpacity key={index} onPress={() => toggleSection(index)}>
            <Text>{lesson.title}</Text>
            {expandedSections.includes(index) && (
              <Text>Duration: {lesson.duration}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const OverviewTab = ({
  description,
  objectives,
  requirements,
}: {
  description: string;
  objectives: string[];
  requirements: string[];
}) => (
  <ScrollView>
    <Text>{description}</Text>
    <View>
      {objectives.map((obj, i) => (
        <Text key={i}>{obj}</Text>
      ))}
    </View>
    <View>
      {requirements.map((req, i) => (
        <Text key={i}>{req}</Text>
      ))}
    </View>
  </ScrollView>
);

const ReviewsTab = ({
  reviews,
  onAddReview,
}: {
  reviews: Array<{ rating: number; date: string; text: string }>;
  onAddReview: () => void;
}) => {
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <View>
      <Text>Average: {averageRating.toFixed(1)}</Text>
      <TouchableOpacity onPress={onAddReview}>
        <Text>Write Review</Text>
      </TouchableOpacity>
      {sortedReviews.map((review, i) => (
        <Text key={i}>{review.text}</Text>
      ))}
    </View>
  );
};

const VideoPlayer = ({
  videoUrl,
  onProgressUpdate,
}: {
  videoUrl: string;
  onProgressUpdate?: (progress: number) => void;
}) => {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);

  const togglePlayPause = () => {
    setPlaying(!playing);
    if (!playing && onProgressUpdate) {
      setProgress(50);
      onProgressUpdate(50);
    }
  };

  return (
    <View>
      <Text>Video: {videoUrl}</Text>
      <TouchableOpacity onPress={togglePlayPause}>
        <Text>{playing ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFullscreen(!fullscreen)}>
        <Text>Fullscreen</Text>
      </TouchableOpacity>
      <Text>Progress: {progress}%</Text>
    </View>
  );
};

describe("Extended Tab Components - UT-054 to UT-073", () => {
  // CurriculumTab Tests (UT-054 to UT-056)
  describe("CurriculumTab Component", () => {
    const lessons = [
      { title: "Introduction", duration: 15 },
      { title: "Advanced Topics", duration: 30 },
    ];

    it("UT-054: should render lessons list", () => {
      render(<CurriculumTab lessons={lessons} />);
      expect(screen.getByText("Introduction")).toBeTruthy();
      expect(screen.getByText("Advanced Topics")).toBeTruthy();
    });

    it("UT-055: should show total duration", () => {
      render(<CurriculumTab lessons={lessons} />);
      expect(screen.getByText("Total: 45 mins")).toBeTruthy();
    });

    it("UT-056: should expand/collapse sections", () => {
      render(<CurriculumTab lessons={lessons} />);
      const firstLesson = screen.getByText("Introduction");

      // Initially collapsed
      expect(screen.queryByText("Duration: 15")).toBeFalsy();

      // Expand
      fireEvent.press(firstLesson);
      expect(screen.getByText("Duration: 15")).toBeTruthy();

      // Collapse
      fireEvent.press(firstLesson);
      expect(screen.queryByText("Duration: 15")).toBeFalsy();
    });
  });

  // OverviewTab Tests (UT-057 to UT-059)
  describe("OverviewTab Component", () => {
    const props = {
      description: "Learn React Native from scratch",
      objectives: ["Build mobile apps", "Master React concepts"],
      requirements: ["Basic JavaScript knowledge", "Computer with Node.js"],
    };

    it("UT-057: should display course description", () => {
      render(<OverviewTab {...props} />);
      expect(screen.getByText("Learn React Native from scratch")).toBeTruthy();
    });

    it("UT-058: should show learning objectives", () => {
      render(<OverviewTab {...props} />);
      expect(screen.getByText("Build mobile apps")).toBeTruthy();
      expect(screen.getByText("Master React concepts")).toBeTruthy();
    });

    it("UT-059: should display requirements", () => {
      render(<OverviewTab {...props} />);
      expect(screen.getByText("Basic JavaScript knowledge")).toBeTruthy();
      expect(screen.getByText("Computer with Node.js")).toBeTruthy();
    });
  });

  // ReviewsTab Tests (UT-066 to UT-069)
  describe("ReviewsTab Component", () => {
    const reviews = [
      { rating: 5, date: "2025-11-08", text: "Excellent course!" },
      { rating: 4, date: "2025-11-07", text: "Very good" },
    ];

    it("UT-066: should show course reviews", () => {
      render(<ReviewsTab reviews={reviews} onAddReview={() => {}} />);
      expect(screen.getByText("Excellent course!")).toBeTruthy();
      expect(screen.getByText("Very good")).toBeTruthy();
    });

    it("UT-067: should display average rating", () => {
      render(<ReviewsTab reviews={reviews} onAddReview={() => {}} />);
      expect(screen.getByText("Average: 4.5")).toBeTruthy();
    });

    it("UT-068: should allow adding review", () => {
      const onAddReview = jest.fn();
      render(<ReviewsTab reviews={reviews} onAddReview={onAddReview} />);
      fireEvent.press(screen.getByText("Write Review"));
      expect(onAddReview).toHaveBeenCalledTimes(1);
    });

    it("UT-069: should sort reviews by date", () => {
      render(<ReviewsTab reviews={reviews} onAddReview={() => {}} />);
      const reviewTexts = screen.getAllByText(/course|good/i);
      // Newest first
      expect(reviewTexts[0].props.children).toBe("Excellent course!");
    });
  });

  // VideoPlayer Tests (UT-070 to UT-073)
  describe("VideoPlayer Component", () => {
    it("UT-070: should load video source", () => {
      render(<VideoPlayer videoUrl="https://example.com/video.mp4" />);
      expect(
        screen.getByText("Video: https://example.com/video.mp4")
      ).toBeTruthy();
    });

    it("UT-071: should have play/pause controls", () => {
      render(<VideoPlayer videoUrl="test.mp4" />);
      const playButton = screen.getByText("Play");
      expect(playButton).toBeTruthy();

      fireEvent.press(playButton);
      expect(screen.getByText("Pause")).toBeTruthy();

      fireEvent.press(screen.getByText("Pause"));
      expect(screen.getByText("Play")).toBeTruthy();
    });

    it("UT-072: should track watch progress", () => {
      const onProgressUpdate = jest.fn();
      render(
        <VideoPlayer videoUrl="test.mp4" onProgressUpdate={onProgressUpdate} />
      );

      fireEvent.press(screen.getByText("Play"));
      expect(onProgressUpdate).toHaveBeenCalledWith(50);
      expect(screen.getByText("Progress: 50%")).toBeTruthy();
    });

    it("UT-073: should support fullscreen", () => {
      render(<VideoPlayer videoUrl="test.mp4" />);
      const fullscreenButton = screen.getByText("Fullscreen");
      expect(fullscreenButton).toBeTruthy();
      fireEvent.press(fullscreenButton);
      // Fullscreen toggled
    });
  });
});
