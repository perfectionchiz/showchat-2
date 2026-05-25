import { View } from "react-native";

export const BadgeSprinkles = () => (
  <View className="absolute inset-0 overflow-hidden pointer-events-none">
    <View
      style={{
        position: "absolute",
        top: 5,
        left: "15%",
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#fbbf24",
        opacity: 0.25,
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 12,
        left: "45%",
        width: 12,
        height: 3,
        backgroundColor: "#f59e0b",
        opacity: 0.2,
        transform: [{ rotate: "15deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 8,
        right: "20%",
        width: 6,
        height: 6,
        backgroundColor: "#ffffff",
        opacity: 0.15,
        transform: [{ rotate: "45deg" }],
      }}
    />

    {/* Group 2: Middle Section */}
    <View
      style={{
        position: "absolute",
        top: "40%",
        left: 10,
        width: 10,
        height: 2,
        backgroundColor: "#fcd34d",
        opacity: 0.2,
        transform: [{ rotate: "-30deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        top: "35%",
        right: 30,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: "#fbbf24",
        opacity: 0.3,
      }}
    />
    <View
      style={{
        position: "absolute",
        top: "50%",
        left: "30%",
        width: 5,
        height: 5,
        backgroundColor: "#ffffff",
        opacity: 0.1,
        transform: [{ rotate: "20deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        top: "55%",
        right: "15%",
        width: 15,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#f59e0b",
        opacity: 0.15,
        transform: [{ rotate: "-15deg" }],
      }}
    />

    {/* Group 3: Bottom Section */}
    <View
      style={{
        position: "absolute",
        bottom: 10,
        left: "10%",
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#fcd34d",
        opacity: 0.25,
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: "40%",
        width: 10,
        height: 10,
        backgroundColor: "#fbbf24",
        opacity: 0.1,
        transform: [{ rotate: "60deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: 5,
        right: "40%",
        width: 8,
        height: 2,
        backgroundColor: "#ffffff",
        opacity: 0.2,
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: 15,
        right: 10,
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: "#f59e0b",
        opacity: 0.3,
      }}
    />

    {/* Extra scattered "dust" */}
    <View
      style={{
        position: "absolute",
        top: "20%",
        left: "60%",
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: "#fbbf24",
        opacity: 0.4,
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: "30%",
        left: "5%",
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#ffffff",
        opacity: 0.2,
      }}
    />
  </View>
);
