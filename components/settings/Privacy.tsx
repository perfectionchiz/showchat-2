import {
  ChevronDown,
  ChevronRight,
  Database,
  ExternalLink,
  FileText,
  Mail,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GradientText } from "../common/GradientText";
import Logo from "../ui/Logo";

export const PrivacyModalContent = () => {
  const [showPolicy, setShowPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showData, setShowData] = useState(false);

  return (
    <View className="flex-1 bg-primary px-4 pb-8">
      <View className="mt-6">
        <Logo size={40} iconSize={20} fontClassName="text-2xl" />
      </View>
      <View className="items-center mb-8 pt-4">
        <View className="bg-indigo-500/10 p-5 rounded-full mb-3 border border-gray-800">
          <ShieldCheck size={38} color="#a5b4fc" />
        </View>
        <Text className="text-white text-2xl font-bold">Privacy Center</Text>
        <Text className="text-gray-300 text-center text-sm mt-2 px-6 leading-5">
          At Showchats, we believe privacy is a fundamental right. Review our
          commitment to your security below.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-gray-300 uppercase text-[11px] font-bold mb-3 ml-1 tracking-widest">
            Security Infrastructure
          </Text>
          <View className="bg-background border border-gray-800 rounded-2xl p-4">
            <View className=" flex-row items-center">
              <View className="bg-emerald-500/10 p-2.5 rounded-xl border border-gray-500">
                <ShieldAlert size={22} color="#10b981" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white font-semibold text-[15px]">
                  End-to-End Encryption
                </Text>
                <Text className="text-gray-300 text-xs mt-1 leading-4">
                  Your private keys are generated and stored locally. Showchats
                  servers act only as a secure relay for your encrypted data
                  packets.
                </Text>
              </View>
            </View>
            <View className="bg-emerald-500/20 px-2 flex-row justify-end w-[70px] ml-auto py-1 rounded">
              <Text className="text-green-500 text-[10px]  font-black">
                ACTIVE
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-300 uppercase text-[11px] font-bold mb-3 ml-1 tracking-widest">
            Legal & Compliance
          </Text>
          <View className="bg-background border border-gray-800 rounded-2xl overflow-hidden">
            {/* 1. DATA PRACTICES */}
            <TouchableOpacity
              onPress={() => setShowData(!showData)}
              className="p-4 flex-row items-center active:bg-gray-800/40"
            >
              <Database size={20} color="#94a3b8" />
              <Text className="ml-4 flex-1 text-white font-medium">
                Data Collection & Usage
              </Text>
              {showData ? (
                <ChevronDown size={18} color="#a5b4fc" />
              ) : (
                <ChevronRight size={18} color="#475569" />
              )}
            </TouchableOpacity>

            {showData && (
              <View className="px-4 pb-5 bg-primary/10">
                <View className="h-[1px] bg-gray-800 mb-4" />
                <Text className="text-gray-300 text-xs leading-5 mb-3">
                  • <Text className="font-bold text-white">Account Info:</Text>{" "}
                  We store your username and hashed phone number to facilitate
                  account recovery.
                </Text>
                <Text className="text-gray-300 text-xs leading-5 mb-3">
                  • <Text className="font-bold text-white">Message Logs:</Text>{" "}
                  We do not store message history. Once a message is delivered
                  to your device, it is purged from our relay servers.
                </Text>
                <Text className="text-gray-300 text-xs leading-5">
                  • <Text className="font-bold text-white">Contacts:</Text> We
                  only hash contact data to help you find friends. We never
                  upload your full address book to our database.
                </Text>
              </View>
            )}

            <View className="h-[1px] bg-gray-800 mx-4" />

            <TouchableOpacity
              onPress={() => setShowPolicy(!showPolicy)}
              className="p-4 flex-row items-center active:bg-gray-800/40"
            >
              <FileText size={20} color="#94a3b8" />
              <Text className="ml-4 flex-1 text-white font-medium">
                Privacy Policy
              </Text>
              {showPolicy ? (
                <ChevronDown size={18} color="#a5b4fc" />
              ) : (
                <ChevronRight size={18} color="#475569" />
              )}
            </TouchableOpacity>

            {showPolicy && (
              <View className="px-4 pb-5 bg-primary/10">
                <View className="h-[1px] bg-gray-800 mb-4" />
                <Text className="text-gray-300 text-xs leading-5 mb-4">
                  Our Privacy Policy explains how we treat your personal data
                  and protect your privacy when you use Showchats. By using our
                  services, you agree that Showchats can use such data in
                  accordance with our policies.
                </Text>
                <Text className="text-gray-300 text-xs leading-5">
                  We are committed to GDPR and CCPA compliance. You have the
                  right to request access to, correction of, or deletion of your
                  personal data at any time through the account settings menu.
                </Text>
              </View>
            )}

            <View className="h-[1px] bg-gray-800 mx-4" />
            <TouchableOpacity
              onPress={() => setShowTerms(!showTerms)}
              className="p-4 flex-row items-center active:bg-gray-800/40"
            >
              <Scale size={20} color="#94a3b8" />
              <Text className="ml-4 flex-1 text-white font-medium">
                Terms of Service
              </Text>
              {showTerms ? (
                <ChevronDown size={18} color="#a5b4fc" />
              ) : (
                <ChevronRight size={18} color="#475569" />
              )}
            </TouchableOpacity>

            {showTerms && (
              <View className="px-4 pb-5 bg-primary/10">
                <View className="h-[1px] bg-gray-800 mb-4" />
                <Text className="text-gray-400 text-xs leading-5 mb-4 font-bold text-white uppercase tracking-tighter">
                  User Obligations:
                </Text>
                <Text className="text-gray-400 text-xs leading-5 mb-4">
                  You are responsible for keeping your device and your account
                  safe and secure. You may not use Showchats to distribute
                  malware, engage in harassment, or facilitate illegal
                  transactions.
                </Text>
                <Text className="text-gray-400 text-xs leading-5">
                  Showchats is provided &rdquo;as is&rdquo; without any express
                  or implied warranties. We do not guarantee that our services
                  will always be functional or free of errors, though we strive
                  for maximum uptime.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-gray-300 uppercase text-[11px] font-bold mb-3 ml-1 tracking-widest">
            Need Help?
          </Text>
          <TouchableOpacity className="bg-background border border-gray-800 rounded-2xl p-4 flex-row items-center">
            <Mail size={20} color="#94a3b8" />
            <View className="ml-4 flex-1">
              <Text className="text-white font-medium">Privacy Support</Text>
              <Text className="text-gray-400 text-xs">
                privacy@showchats.com
              </Text>
            </View>
            <ExternalLink size={16} color="#475569" />
          </TouchableOpacity>
        </View>

        <View className="mt-4 mb-8 items-center">
          <GradientText className="text-gray-300 text-[10px] font-bold tracking-widest">
            SHOWCHATS V1.0.0.0
          </GradientText>

          <Text className="text-gray-400 text-[9px] mt-2">
            © 2026 Showchats Inc. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
