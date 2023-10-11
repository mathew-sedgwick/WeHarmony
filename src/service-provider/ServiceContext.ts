import { createContext } from "react";
import { AuthenticationService } from "../services/authentication/AuthenticationService";
import { BrandingService } from "../services/branding/BrandingService";
import { LocalizationService } from "../services/localization/LocalizationService";
import { DataService } from "../services/data/DataService";

export interface ServiceRegistry {
  authenticationService: AuthenticationService;
  localizationService: LocalizationService;
  brandingService: BrandingService;
  dataService: DataService;
}

export const ServiceContext = createContext<ServiceRegistry | undefined>(
  undefined
);
