import { PRIMARY_COLOR } from "@/constants/constants";
import { User } from "@/models/auth.model";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { CameraIcon, GemIcon } from "lucide-react-native";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { IconButton } from "../common/IconButton";
import { Text } from "../ui/Text";

type ProfileAvatarSectionProps = {
  values: any;
  profile: User | null;
  setFieldValue: (field: string, value: any) => void;
  pickImage: (setFieldValue: any) => void;
  setIsSubOpen: (val: boolean) => void;
};

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  values,
  profile,
  setFieldValue,
  pickImage,
  setIsSubOpen,
}) => {
  return (
    <View className="">
      <View className="flex-row gap-x-4">
        <View className="relative">
          <TouchableOpacity
            onPress={() => pickImage(setFieldValue)}
            activeOpacity={0.8}
          >
            {Platform.OS !== "web" ? (
              <View
                className="absolute"
                style={{
                  width: 95,
                  height: 95,
                  borderRadius: 999,
                  top: -6,
                  left: -6,
                  backgroundColor: "rgba(249,115,22,0.15)",
                  shadowColor: "#F97316",
                  shadowOpacity: 0.8,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 10,
                }}
              />
            ) : null}
            {values.avatar_url ? (
              <View
                style={{ borderColor: PRIMARY_COLOR }}
                className="w-24 h-24 bg-white rounded-full overflow-hidden border"
              >
                <Image
                  source={{ uri: values.avatar_url }}
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
            ) : (
              <View className="w-24 h-24 border-2 border-gray-500 rounded-full justify-center items-center bg-secondary/10">
                <CameraIcon size={29} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {values.avatar_url && (
            <IconButton
              size={30}
              icon={<Ionicons name="camera-sharp" size={16} color="white" />}
              onPress={() => pickImage(setFieldValue)}
              style={{ bottom: 5, right: -5 }}
              className="absolute bg-primary border border-white/10 w-8 h-8 rounded-full"
            />
          )}
        </View>

        <View>
          <View style={{ marginLeft: 6 }} className="mt-3">
            <Text variant="medium" className=" text-gray-300">
              Personalize your chat profile
            </Text>
            {profile?.is_premium ? (
              <View
                className="flex-row mt-2 items-center px-4 py-2 rounded-2xl border border-yellow-500/30 shadow-lg shadow-yellow-500/20"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  width: 130,
                  elevation: 8,
                }}
              >
                <View
                  style={{
                    shadowColor: "#f59e0b",
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                  }}
                >
                  <GemIcon color="#f59e0b" size={14} fill="#f59e0b" />
                </View>

                <Text className="text-white font-black uppercase text-[10px] tracking-[2px] ml-2">
                  Premium
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsSubOpen(true)}
                className="flex-row items-center mt-2 bg-yellow-500 px-6 py-3 rounded-2xl shadow-xl shadow-yellow-500/40"
                style={{ elevation: 8, width: 140 }}
              >
                <GemIcon color="#fff" size={18} />
                <Text className="text-white font-black uppercase text-[12px] tracking-widest ml-2">
                  Upgrade
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileAvatarSection;
