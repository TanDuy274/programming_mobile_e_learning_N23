import React from "react";
import { Text } from "react-native";

const MockIcon = (props: any) => (
  <Text testID={props.testID || "mock-icon"}>{props.name}</Text>
);

export const Ionicons = MockIcon;
export const MaterialIcons = MockIcon;
export const FontAwesome = MockIcon;
export const MaterialCommunityIcons = MockIcon;
export const Feather = MockIcon;
export const AntDesign = MockIcon;
export const Entypo = MockIcon;
export const FontAwesome5 = MockIcon;
