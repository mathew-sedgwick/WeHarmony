import { createContext } from "react";
import { AuthenticationService } from "../services/authentication/AuthenticationService";
import { BrandingService } from "../services/branding/BrandingService";
import { LocalizationService } from "../services/localization/LocalizationService";

export interface ServiceRegistry {
  authenticationService: AuthenticationService;
  localizationService: LocalizationService;
  brandingService: BrandingService;
}

export const ServiceContext = createContext<ServiceRegistry | undefined>(
  undefined
);
