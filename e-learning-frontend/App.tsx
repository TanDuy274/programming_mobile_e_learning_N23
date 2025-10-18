import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import { Text, View } from "react-native";
import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
