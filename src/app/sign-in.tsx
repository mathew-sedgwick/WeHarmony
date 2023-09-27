import { FC, useCallback, useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { DEFAULT_STYLES } from "../services/branding/Styles";
import { ServiceContext } from "../service-provider/ServiceContext";

export interface SignInProperties {}

const SignIn: FC<SignInProperties> = (props) => {
  const { authenticationService, localizationService } =
    useContext(ServiceContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignIn = useCallback(async () => {
    try {
      authenticationService.signIn(email, password);
    } catch (e) {
      // TODO
      alert(JSON.stringify(e));
    }
  }, [email, password]);
  const handleRegister = useCallback(() => {
    try {
      authenticationService.register(email, password);
    } catch (e) {
      // TODO
      alert(JSON.stringify(e));
    }
  }, [email, password]);
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={localizationService.translate("language-sign-in-email")}
          value={email}
          onChangeText={(txt) => setEmail(txt)}
          style={styles.input}
        />
        <TextInput
          placeholder={localizationService.translate(
            "language-sign-in-password"
          )}
          value={password}
          onChangeText={(txt) => setPassword(txt)}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text>
            {localizationService.translate("language-sign-in-sign-in")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text>
            {localizationService.translate("language-sign-in-register")}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  ...DEFAULT_STYLES,
  container: {
    ...DEFAULT_STYLES.container,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {},
});
