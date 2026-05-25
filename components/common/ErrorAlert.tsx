import { Alert } from "react-native";

export const showErrorAlert = (message: string, title = "Error") => {
  Alert.alert(title, message, [{ text: "OK", style: "default" }]);
};
