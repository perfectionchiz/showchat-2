import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Dimensions,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import emojiData from "unicode-emoji-json";
import { Text } from "../ui/Text";

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUM_COLUMNS = 8;
const EMOJI_SIZE = Math.floor(SCREEN_WIDTH / NUM_COLUMNS);

const CATEGORIES = [
  { label: "All", keywords: [] },
  {
    label: "Smileys",
    keywords: ["face", "smile", "happy", "laugh", "grin", "joy"],
  },
  { label: "People", keywords: ["person", "hand", "skin", "family"] },
  {
    label: "Animals",
    keywords: ["animal", "cat", "dog", "bear", "bird", "fish"],
  },
  { label: "Food", keywords: ["food", "fruit", "drink", "vegetable", "meat"] },
  { label: "Activities", keywords: ["sport", "game", "ball", "run", "dance"] },
  { label: "Travel", keywords: ["travel", "vehicle", "car", "plane", "train"] },
];

const ALL_EMOJIS = Object.entries(emojiData).map(([emoji, details]) => ({
  emoji,
  name: (details.name || "").toLowerCase(),
  group: (details as any).group?.toLowerCase() || "",
}));

export type EmojiPickerHandle = {
  open: () => void;
  close: () => void;
};

type Props = {
  onEmojiSelect: (emoji: string) => void;
  showTrigger?: boolean;
};

const EmojiItem = React.memo(
  ({ emoji, onSelect }: { emoji: string; onSelect: (e: string) => void }) => (
    <Pressable
      onPress={() => onSelect(emoji)}
      style={styles.emojiWrapper}
      android_ripple={{ color: "rgba(255,255,255,0.15)", borderless: true }}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
    </Pressable>
  ),
);

export const FullEmojiPicker = forwardRef<EmojiPickerHandle, Props>(
  ({ onEmojiSelect, showTrigger = true }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetModalRef.current?.present(),
      close: () => bottomSheetModalRef.current?.dismiss(),
    }));

    const snapPoints = useMemo(() => ["60%", "92%"], []);

    const filteredEmojis = useMemo(() => {
      const query = search.toLowerCase().trim();

      return ALL_EMOJIS.filter((item) => {
        const matchesSearch =
          !query || item.emoji.includes(query) || item.name.includes(query);

        if (!matchesSearch) return false;

        if (activeCategory === "All") return true;

        const cat = CATEGORIES.find((c) => c.label === activeCategory);
        if (!cat || cat.keywords.length === 0) return true;

        return cat.keywords.some(
          (keyword) =>
            item.name.includes(keyword) || item.group.includes(keyword),
        );
      });
    }, [search, activeCategory]);

    const handleSelect = useCallback(
      (emoji: string) => {
        onEmojiSelect(emoji);
        bottomSheetModalRef.current?.dismiss();
        setSearch("");
        setActiveCategory("All");
      },
      [onEmojiSelect],
    );

    const renderItem = useCallback(
      ({ item }: { item: (typeof ALL_EMOJIS)[0] }) => (
        <EmojiItem emoji={item.emoji} onSelect={handleSelect} />
      ),
      [handleSelect],
    );

    const getItemLayout = useCallback(
      (_: any, index: number) => ({
        length: EMOJI_SIZE,
        offset: EMOJI_SIZE * Math.floor(index / NUM_COLUMNS),
        index,
      }),
      [],
    );

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
      [],
    );

    return (
      <View>
        {showTrigger && (
          <Pressable
            onPress={() => bottomSheetModalRef.current?.present()}
            style={styles.trigger}
          >
            <Text style={{ color: "#818cf8", fontSize: 20 }}>+</Text>
          </Pressable>
        )}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.indicator}
          keyboardBehavior="fillParent"
          enableDynamicSizing={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search emojis..."
                  placeholderTextColor="#94a3b8"
                  style={styles.searchInput}
                  value={search}
                  onChangeText={(t) => {
                    setSearch(t);
                    if (t) setActiveCategory("All");
                  }}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.label}
                    onPress={() => {
                      setActiveCategory(cat.label);
                      setSearch("");
                    }}
                    style={[
                      styles.catBtn,
                      activeCategory === cat.label && styles.catBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.catText,
                        activeCategory === cat.label && styles.catTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <BottomSheetFlatList
              data={filteredEmojis}
              keyExtractor={(item) => item.emoji}
              renderItem={renderItem}
              numColumns={NUM_COLUMNS}
              getItemLayout={getItemLayout}
              initialNumToRender={48}
              maxToRenderPerBatch={32}
              windowSize={7}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </BottomSheetModal>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  trigger: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetBackground: { backgroundColor: "#0f172a" },
  indicator: { backgroundColor: "#475569", width: 40 },

  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },

  searchContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: "center",
  },
  searchInput: {
    color: "white",
    fontSize: 16,
  },

  categoryRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
    flexWrap: "wrap",
  },
  catBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#1e293b",
  },
  catBtnActive: { backgroundColor: "#f44034" },
  catText: { fontSize: 13.5, color: "#94a3b8" },
  catTextActive: { color: "white", fontWeight: "600" },

  listContent: {
    paddingBottom: 40,
    paddingHorizontal: 4,
  },

  emojiWrapper: {
    width: EMOJI_SIZE,
    height: EMOJI_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiText: {
    fontSize: 32,
    color: "white",
    fontFamily: "System",
    includeFontPadding: false,
    textAlign: "center",
  },
});

EmojiItem.displayName = "EmojiItem";
FullEmojiPicker.displayName = "FullEmojiPicker";
