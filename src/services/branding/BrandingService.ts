import { ColorPalette } from "./ColorPalette";

export type BrandingTheme = "light";

export interface BrandingServiceProperties {
  theme?: BrandingTheme;
}

export interface BrandingService {
  theme: BrandingTheme;
  readonly colors: ColorPalette;
}
