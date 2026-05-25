import { Search } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Input } from "./Input";

interface DebouncedSearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  debounceMs?: number;
}

export default function DebouncedSearchInput({
  placeholder = "Search live shows (e.g. 'NBA', 'The Office')",
  onSearch,
  initialValue = "",
  debounceMs = 500,
}: DebouncedSearchInputProps) {
  const [value, setValue] = useState(initialValue);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current(value.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  const handleChangeText = (text: string) => {
    setValue(text);
  };

  const handleClear = () => {
    setValue("");
    onSearchRef.current("");
  };

  return (
    <View>
      <Input
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        onClear={handleClear}
        showClearButton
        leftIcon={<Search size={20} color="#9ca3af" />}
        inputClassName="rounded-2xl bg-primary border border-gray-800"
      />
    </View>
  );
}
