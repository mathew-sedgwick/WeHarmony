import { StyleSheet } from "react-native";
import { FC, useEffect } from "react";
import ServiceProvider from "../service-provider/ServiceProvider";
import { router, Stack } from "expo-router";
import "expo-router/entry";
import { DefaultAuthenticationService } from "src/services/authentication/DefaultAuthenticationService";
import { DefaultLocalizationService } from "src/services/localization/DefaultLocalizationService";
import { DefaultBrandingService } from "src/services/branding/DefaultBrandingService";

// export const unstable_settings = {
// };

const AUTH_SERVICE = new DefaultAuthenticationService({
  onSignIn: () => {
    router.replace("home");
  },
  onSignOut: () => {
    router.replace("sign-in");
  },
});
const LOCALIZATION_SERVICE = new DefaultLocalizationService({});
const BRANDING_SERVICE = new DefaultBrandingService({});

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
