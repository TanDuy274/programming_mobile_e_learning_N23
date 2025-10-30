export interface Lesson {
  _id: string;
  title: string;
  duration: number;
  youtubeVideoId: string;
}

export interface CourseData {
  title: string;
  lessons: Lesson[];
}
