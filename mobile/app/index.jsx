import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>minh le hehe</Text>

      <Link href="/(auth)/signup">Signup page</Link>
      <Link href="/(auth)">Login page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
        justifyContent: "center",
        alignItems: "center",
  },
  title: {
    color: "green",
  }
})