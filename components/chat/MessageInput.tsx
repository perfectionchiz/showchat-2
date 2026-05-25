import { Send } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

export function ChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <View className="flex-row gap-2 border-t border-zinc-800 p-4 bg-[#0b1220]">
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Say something..."
        placeholderTextColor="#94a3b8"
        className="flex-1 bg-[#0e162b] text-white px-4 py-3 rounded-xl"
      />

      <Pressable
        onPress={onSend}
        className="bg-red-500 w-12 items-center justify-center rounded-xl"
      >
        <Send size={18} color="white" />
      </Pressable>
    </View>
  );
}
