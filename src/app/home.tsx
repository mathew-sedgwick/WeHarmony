import { FC, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ServiceContext } from "../service-provider/ServiceContext";
import { DEFAULT_STYLES } from "../services/branding/Styles";

export interface HomeProperties {}

const Home: FC<HomeProperties> = () => {
  const { authenticationService } = useContext(ServiceContext)!;
  return (
    <View style={styles.container}>
      <Text>HELLO WORLD</Text>
      <Text>{authenticationService.user?.email}</Text>
      <TouchableOpacity onPress={() => authenticationService.signOut()}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ...DEFAULT_STYLES,
});

export default Home;
