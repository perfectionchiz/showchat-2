import { shadowStyle } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik, FormikHelpers, FormikProps } from "formik";
import React, { ReactNode, forwardRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ViewStyle,
} from "react-native";
import { Button } from "../common/Button";
import HeroOverlays from "../layout/HeroGradient";
import { FloatingEmojis } from "../ui/FloatingEmoji";
import Logo from "../ui/Logo";
import { Text } from "../ui/Text";

interface FormWrapperProps<T extends Record<string, any>> {
  title?: string;
  subtitle?: string;
  header?: string;
  initialValues?: T;
  validationSchema?: any;
  containerStyle?: ViewStyle;
  onSubmit?: (values: T, helpers: FormikHelpers<T>) => void;
  children: ReactNode | ((formik: FormikProps<T>) => ReactNode);
}

function FormWrapperComponent<T extends Record<string, any>>(
  {
    title,
    subtitle,
    children,
    header,
    initialValues,
    validationSchema,
    onSubmit,
    containerStyle,
  }: FormWrapperProps<T>,
  ref: React.ForwardedRef<FormikProps<T>>,
) {
  const renderSafe = (child: ReactNode) =>
    React.Children.map(child, (c) =>
      typeof c === "string" || typeof c === "number" ? <Text>{c}</Text> : c,
    );

  const renderChildren = (formik?: FormikProps<T>) => {
    if (typeof children === "function")
      return renderSafe(children(formik as FormikProps<T>));
    return renderSafe(children);
  };

  return (
    <View style={containerStyle} className="flex-1 bg-background">
      {header && <FloatingEmojis />}
      {header && <HeroOverlays />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: header ? 16 : 0,
            paddingTop: header ? 40 : 0,
            paddingBottom: 120,
          }}
        >
          {header && (
            <View className="items-center mb-5">
              {Platform.OS === "web" ? <Logo /> : <Logo style={shadowStyle} />}
              {header && (
                <Text className="text-muted-foreground mt-4">{header}</Text>
              )}
            </View>
          )}

          {initialValues && onSubmit ? (
            <Formik
              innerRef={ref}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              {(formikHelpers) =>
                header ? (
                  <View className="rounded-xl p-7 border border-gray-800 bg-primary relative">
                    {title && (
                      <Text
                        variant="bold"
                        className="text-white text-center text-2xl mb-1"
                      >
                        {title}
                      </Text>
                    )}
                    {subtitle && (
                      <Text className="text-gray-400 text-center text-base mb-8">
                        {subtitle}
                      </Text>
                    )}
                    {renderChildren(formikHelpers)}
                  </View>
                ) : (
                  <View className="flex-1">
                    {renderChildren(formikHelpers)}
                  </View>
                )
              }
            </Formik>
          ) : header ? (
            <View className="rounded-xl p-7 border border-gray-800 bg-primary relative">
              {title && (
                <Text
                  variant="bold"
                  className="text-white text-center text-2xl mb-1"
                >
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text className="text-gray-400 text-center text-base mb-8">
                  {subtitle}
                </Text>
              )}
              <View className="rounded-xl relative">{renderChildren()}</View>
            </View>
          ) : (
            <View>{renderChildren()}</View>
          )}

          {header && (
            <Button
              onPress={() => router.push("/home")}
              variant="ghost"
              className="mt-1"
              isLoading={false}
              icon={<Ionicons name="arrow-back" size={20} color="#9ca3af" />}
              textClassName="text-gray-400"
            >
              Back to home
            </Button>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default forwardRef(FormWrapperComponent) as <
  T extends Record<string, any>,
>(
  props: FormWrapperProps<T> & { ref?: React.ForwardedRef<FormikProps<T>> },
) => React.ReactElement;
