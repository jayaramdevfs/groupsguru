import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/tokens";
import LoginScreen from "../screens/LoginScreen";
import AdminDashboard from "../screens/AdminDashboard";
import StudentDashboard from "../screens/StudentDashboard";
import CategoryScreen from "../screens/CategoryScreen";
import SubCategoryScreen from "../screens/SubCategoryScreen";
import SectionScreen from "../screens/SectionScreen";
import TopicScreen from "../screens/TopicScreen";
import MicroTopicScreen from "../screens/MicroTopicScreen";
import IntelligenceScreen from "../screens/IntelligenceScreen";
import QuestionListScreen from "../screens/QuestionListScreen";
import ExamListScreen from "../screens/ExamListScreen";
import ExamDetailScreen from "../screens/ExamDetailScreen";
import ExamAttemptScreen from "../screens/ExamAttemptScreen";
import ExamResultScreen from "../screens/ExamResultScreen";

export type RootStackParamList = {
  Login: undefined;
  AdminDashboard: undefined;
  StudentDashboard: undefined;
  Category: { commissionId?: number; commissionName?: string };
  SubCategory: {
    categoryId: number;
    categoryName: string;
    categoryNameTe: string;
  };
  Section: {
    subCategoryId: number;
    subCategoryName: string;
    subCategoryNameTe: string;
  };
  Topic: { sectionId: number; sectionName: string; sectionNameTe: string };
  MicroTopic: { topicId: number; topicName: string; topicNameTe: string };
  Intelligence: undefined;
  QuestionList: undefined;
  ExamList: undefined;
  ExamDetail: { examId: number };
  ExamAttempt: { examId: number };
  ExamResult: { attemptId: number; examId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user === null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === "ADMIN" ? (
          <>
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboard}
            />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen
              name="SubCategory"
              component={SubCategoryScreen}
            />
            <Stack.Screen name="Section" component={SectionScreen} />
            <Stack.Screen name="Topic" component={TopicScreen} />
            <Stack.Screen name="MicroTopic" component={MicroTopicScreen} />
            <Stack.Screen
              name="Intelligence"
              component={IntelligenceScreen}
            />
            <Stack.Screen
              name="QuestionList"
              component={QuestionListScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="StudentDashboard"
              component={StudentDashboard}
            />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen
              name="SubCategory"
              component={SubCategoryScreen}
            />
            <Stack.Screen name="Section" component={SectionScreen} />
            <Stack.Screen name="Topic" component={TopicScreen} />
            <Stack.Screen name="MicroTopic" component={MicroTopicScreen} />
            <Stack.Screen name="ExamList" component={ExamListScreen} />
            <Stack.Screen name="ExamDetail" component={ExamDetailScreen} />
            <Stack.Screen
              name="ExamAttempt"
              component={ExamAttemptScreen}
            />
            <Stack.Screen name="ExamResult" component={ExamResultScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: colors.base,
    justifyContent: "center",
    alignItems: "center",
  },
});
