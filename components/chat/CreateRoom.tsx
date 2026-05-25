import { Button } from "@/components/common/Button";
import FormWrapper from "@/components/forms/FormWrapper";
import { Input } from "@/components/forms/Input";
import { Text } from "@/components/ui/Text";
import { PRIMARY_COLOR } from "@/constants/constants";
import { getInitials } from "@/utils/getInitials";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Yup from "yup";

const RoomSchema = Yup.object().shape({
  name: Yup.string().required("Room name is required"),
  description: Yup.string(),
  image_url: Yup.string().nullable(),
});

export interface CreateRoomForm {
  name: string;
  description: string;
  image_url?: string | null;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  initialValues?: CreateRoomForm;
  mutate: (values: CreateRoomForm, file: any) => void;
  isLoading?: boolean;
};

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.75;

export const CreateRoomModal: React.FC<Props> = ({
  visible,
  onClose,
  initialValues,
  mutate,
  isLoading,
}) => {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const handleClose = useCallback(() => {
    translateY.value = withTiming(
      SHEET_HEIGHT,
      { duration: 200 },
      (finished) => {
        if (finished) runOnJS(onClose)();
      },
    );
  }, [onClose]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hide = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 250 });
    } else {
      translateY.value = SHEET_HEIGHT;
    }
  }, [visible]);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 600) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - keyboardHeight / 2 }],
  }));

  const pickImage = async (
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFieldValue("image_url", asset.uri);

      setSelectedFile({
        uri: asset.uri,
        name: asset.fileName || `room-avatar-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Pressable
          onPress={handleClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        />

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[animatedStyle, { height: SHEET_HEIGHT }]}
            className="bg-background border-t border-gray-800 rounded-t-3xl overflow-hidden"
          >
            <View className="items-center py-4">
              <View className="w-12 h-1.5 bg-gray-700 rounded-full" />
            </View>

            <FormWrapper<CreateRoomForm>
              initialValues={
                initialValues || {
                  name: "",
                  description: "",
                  image_url: null,
                }
              }
              validationSchema={RoomSchema}
              onSubmit={async (values) => {
                await mutate(values, selectedFile);
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                errors,
                touched,
                isValid,
                handleSubmit,
                setFieldValue,
              }) => (
                <View className="flex-1 px-6 pb-10">
                  <View className="items-center mb-6">
                    <Text variant="semibold" className="text-white text-2xl">
                      Create Room
                    </Text>
                    <Text className="text-gray-400 text-sm text-center">
                      Set up your private space
                    </Text>
                  </View>

                  <View className="items-center mb-8">
                    <TouchableOpacity
                      onPress={() => pickImage(setFieldValue)}
                      className="relative"
                    >
                      <View className="w-24 h-24 rounded-3xl border-2 border-dashed border-gray-700 items-center justify-center overflow-hidden">
                        {values.image_url ? (
                          <Image
                            source={{ uri: values.image_url }}
                            className="w-full h-full"
                          />
                        ) : (
                          <Text className="text-gray-500 text-4xl font-bold">
                            {getInitials(values.name || "R")}
                          </Text>
                        )}
                      </View>

                      <View
                        style={{ backgroundColor: PRIMARY_COLOR }}
                        className="absolute -bottom-1 -right-1  p-1.5 rounded-full border-4 border-primary"
                      >
                        <Ionicons name="camera" size={16} color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View className="p-6 rounded-2xl border border-gray-800 bg-primary/20">
                    <Input
                      label="ROOM NAME"
                      placeholder="e.g. The Chill Zone"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      error={touched.name ? errors.name : undefined}
                      containerClassName="mb-4"
                    />

                    <Input
                      label="DESCRIPTION"
                      placeholder="What's this room about?"
                      value={values.description}
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      containerClassName="mb-6"
                    />

                    <Button
                      onPress={() => handleSubmit()}
                      style={{ backgroundColor: PRIMARY_COLOR }}
                      disabled={!isValid || isLoading}
                      isLoading={isLoading}
                    >
                      <Text className="text-white font-bold">Create Room</Text>
                    </Button>
                  </View>
                </View>
              )}
            </FormWrapper>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};
