import { Alert, Platform } from "react-native";

interface ConfirmationOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
}

export const showConfirmation = ({
  title,
  message,
  onConfirm,
  confirmText,
  cancelText,
}: ConfirmationOptions) => {
  if (Platform.OS === "web") {
    if (window.confirm(message)) {
      onConfirm();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: "cancel",
        },
        {
          text: confirmText,
          onPress: onConfirm,
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  }
};
