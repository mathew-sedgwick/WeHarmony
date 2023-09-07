import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import type { FC } from "react";

const App: FC = () => {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app! Woohoo!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
