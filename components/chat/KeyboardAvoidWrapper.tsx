import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

interface KeyboardAvoidingWrapperProps {
  children: ReactNode;
}

export default function KeyboardAvoidingWrapper({
  children,
}: KeyboardAvoidingWrapperProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
