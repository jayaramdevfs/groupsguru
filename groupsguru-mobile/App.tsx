import React from "react";
import { StatusBar } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;