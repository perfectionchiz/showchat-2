import { LinearGradient } from "expo-linear-gradient";

export default function HeroOverlays() {
  return (
    <>
      <LinearGradient
        colors={["hsla(4, 90%, 58%, 0.1)", "hsla(210, 100%, 56%, 0.2)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          opacity: 50,
          left: 0,
        }}
        pointerEvents="none"
      />

      <LinearGradient
        colors={["transparent", "transparent", "#0b1220"]}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
        pointerEvents="none"
      />
    </>
  );
}
