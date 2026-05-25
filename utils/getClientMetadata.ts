import * as Application from "expo-application";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { Platform } from "react-native";

export const fetchClientMetadata = async (includeLocation: boolean = false) => {
  let ipAddress = "0.0.0.0";
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    ipAddress = data.ip;
  } catch (e) {
    console.warn("IP fetch failed");
  }

  const deviceModel = Device.modelName ?? "Mobile Device";
  const os = Device.osName ?? Platform.OS;
  const version = Device.osVersion ?? "";
  const userAgent = `${deviceModel} (${os} ${version})`.trim();

  let deviceFingerprint = "mobile-dev";
  try {
    if (Platform.OS === "ios") {
      deviceFingerprint =
        (await Application.getIosIdForVendorAsync()) ?? "ios-unknown";
    } else if (Platform.OS === "android") {
      deviceFingerprint = Application.getAndroidId() ?? "android-unknown";
    }
  } catch (e) {
    console.warn("Fingerprint failed");
  }

  let location = ipAddress;

  if (includeLocation) {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        const permission = await Location.requestForegroundPermissionsAsync();
        status = permission.status;
      }

      if (status === "granted") {
        let loc = await Location.getLastKnownPositionAsync({});
        if (!loc) {
          loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
        }

        if (loc) {
          const reverseCoords = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });

          if (reverseCoords && reverseCoords.length > 0) {
            const address = reverseCoords[0];
            const city = address.city || address.district || address.region;
            const country = address.country;

            if (city || country) {
              location =
                city && country
                  ? `${city}, ${country}`
                  : city || country || ipAddress;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Location error, using IP fallback", e);
    }
  }

  return {
    ipAddress,
    userAgent,
    location,
    deviceFingerprint,
    deviceType: Device.deviceType === 2 ? "tablet" : "mobile",
  };
};
