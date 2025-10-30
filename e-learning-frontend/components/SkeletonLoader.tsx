import React from "react";
import { View } from "react-native";

const SkeletonLoader = ({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) => {
  return (
    <View
      style={{ width, height }}
      className={`bg-gray-200 rounded-lg ${className}`}
    />
  );
};

export default SkeletonLoader;
