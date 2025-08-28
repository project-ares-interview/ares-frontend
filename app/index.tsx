import { Link } from "expo-router";
import { View } from "react-native";

import { Text } from "@rneui/themed";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 64, fontWeight: "bold" }}>
        Hello React Native
      </Text>

      <Link href="/example">Go to Example</Link>
    </View>
  );
}
