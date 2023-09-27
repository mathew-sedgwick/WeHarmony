import { Evented } from "../../support/Evented";
import {
  BrandingService,
  BrandingServiceProperties,
  BrandingTheme,
} from "./BrandingService";
import { ColorPalette } from "./ColorPalette";
import { LIGHT_THEME } from "./LightTheme";

export interface DefaultBrandingServiceProperties
  extends BrandingServiceProperties {}

export class DefaultBrandingService extends Evented implements BrandingService {
  theme: BrandingTheme;

  constructor(properties?: DefaultBrandingServiceProperties) {
    super();
    this.theme = properties?.theme ?? "light";
  }
  get colors(): ColorPalette {
    return LIGHT_THEME;
  }
}
