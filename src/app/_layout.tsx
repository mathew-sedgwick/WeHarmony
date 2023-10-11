import { StyleSheet } from "react-native";
import { FC, useEffect } from "react";
import ServiceProvider from "../service-provider/ServiceProvider";
import { router, Stack } from "expo-router";
import "expo-router/entry";
import { DefaultAuthenticationService } from "../services/authentication/DefaultAuthenticationService";
import { DefaultLocalizationService } from "../services/localization/DefaultLocalizationService";
import { DefaultBrandingService } from "../services/branding/DefaultBrandingService";
import { DefaultDataService } from "../services/data/DefaultDataService";

// export const unstable_settings = {
// };

const AUTH_SERVICE = new DefaultAuthenticationService({
  onSignIn: async (user) => {
    user.dataService = DATA_SERVICE;
    router.replace("home");
    await user.pull();
  },
  onSignOut: () => {
    router.replace("sign-in");
  },
  onRegister: async (user) => {
    user.dataService = DATA_SERVICE;
    await user.push();
    await user.pull();
  },
});
const LOCALIZATION_SERVICE = new DefaultLocalizationService({});
const BRANDING_SERVICE = new DefaultBrandingService({});
const DATA_SERVICE = new DefaultDataService({});

const App: FC = () => {
  useEffect(() => {
    if (AUTH_SERVICE.user) {
      router.replace("home");
    } else {
      router.replace("sign-in");
    }
  }, []);
  return (
    <ServiceProvider
      serviceRegistry={{
        authenticationService: AUTH_SERVICE,
        localizationService: LOCALIZATION_SERVICE,
        brandingService: BRANDING_SERVICE,
        dataService: DATA_SERVICE,
      }}
    >
      <Stack>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="home" />
      </Stack>
    </ServiceProvider>
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
