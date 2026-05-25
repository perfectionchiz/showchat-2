import { Dropdown } from "@/components/common/Dropdown";
import { IconButton } from "@/components/common/IconButton";
import DebouncedSearchInput from "@/components/forms/SearchInput";
import GuideList from "@/components/guide/GuideList";
import { useGuideScreenData } from "@/components/guide/useGuideScreenData";
import { CustomTabs } from "@/components/navigation/CustomTabs";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Text } from "@/components/ui/Text";
import { PRIMARY_COLOR } from "@/constants/constants";
import { useGetChannels } from "@/hooks/channels/useGetChannels";
import { ArrowUp01Icon, Filter, TrendingUp } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

export default function GuideScreen() {
  const [activeTab, setActiveTab] = useState<"now" | "upnext" | "later">("now");

  const [search, setSearch] = useState("");
  const [searchChannel, setSearchChannel] = useState("");
  const [title, setTitle] = useState("now");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const { data } = useGetChannels(searchChannel);

  const channelOptions = useMemo(() => {
    const channels = data?.pages.flatMap((page) => page.channels ?? []) ?? [];

    return channels.map((channel) => ({
      label: channel.name,
      value: channel.name,
    }));
  }, [data]);
  const tabs: { label: string; value: "now" | "upnext" | "later" }[] = [
    { label: "Now", value: "now" },
    { label: "Up Next", value: "upnext" },
    { label: "Later", value: "later" },
  ];

  const { trending, recommended, allShows, guideData, isLoading } =
    useGuideScreenData(search, activeTab, selectedChannelId ?? "");

  const sections = useMemo(
    () => [
      {
        title: "Trending Live",
        icon: <TrendingUp size={18} color="#95A3B8" />,
        data: trending,
      },
      {
        title: "Recommended For You",
        icon: <ArrowUp01Icon size={18} color="#95A3B8" />,
        data: recommended,
      },
      {
        title: "All Shows",
        icon: <ArrowUp01Icon size={18} color="#95A3B8" />,
        data: allShows,
      },
    ],
    [trending, recommended, allShows],
  );

  return (
    <SafeAreaWrapper>
      <View>
        <Text
          style={{ fontSize: 25 }}
          variant="bold"
          className="text-3xl px-4 text-white pt-6 pb-4"
        >
          Guide
        </Text>
      </View>
      <View className="px-4 pt-2">
        <DebouncedSearchInput onSearch={setSearch} placeholder="Search..." />

        <View className="mt-3 mb-2">
          <View className="px-1">
            <Dropdown
              data={channelOptions}
              value={selectedChannelId}
              onChange={(value) => {
                setSelectedChannelId(value);
                setTitle(value);
              }}
              onSearch={setSearchChannel}
              loading={isLoading}
              open={filterOpen}
              onOpenChange={setFilterOpen}
            />
          </View>
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(value) => {
              setActiveTab(value);
              setTitle(value);
            }}
            extraRight={
              <IconButton
                className="bg-primary p-2 rounded-2xl"
                onPress={() => setFilterOpen((p) => !p)}
                icon={<Filter color={PRIMARY_COLOR} size={25} />}
              />
            }
          />
        </View>
      </View>
      <GuideList
        guideData={guideData}
        title={title}
        trendingStreams={trending}
        recommendedStreams={recommended}
        sections={sections}
        isLoading={isLoading}
        isError={false}
        refetch={() => {}}
      />
    </SafeAreaWrapper>
  );
}
