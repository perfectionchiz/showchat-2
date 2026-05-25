import ChannelBrowserList from "@/components/channels/ChannelBrowserList";
import DebouncedSearchInput from "@/components/forms/SearchInput";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Text } from "@/components/ui/Text";
import { useGetChannels } from "@/hooks/channels/useGetChannels";
import { useState } from "react";
import { View } from "react-native";

const Channels = () => {
  const [search, setSearch] = useState("");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useGetChannels(search);

  const channels = data?.pages?.flatMap((p) => p.channels) ?? [];

  return (
    <SafeAreaWrapper>
      <View className="px-4">
        <Text
          style={{ fontSize: 23 }}
          variant="bold"
          className="text-3xl  text-white pt-6 pb-4"
        >
          Channels
        </Text>

        <View className="mt-2 pb-4">
          <DebouncedSearchInput
            initialValue={search}
            onSearch={setSearch}
            placeholder="Search..."
          />
        </View>
      </View>
      <ChannelBrowserList
        channels={channels}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        refetch={() => {
          setSearch("");
          refetch();
        }}
      />
    </SafeAreaWrapper>
  );
};
export default Channels;
