import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import { Text, View } from "react-native";
import TabNavigator from "./src/navigation/TabNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
