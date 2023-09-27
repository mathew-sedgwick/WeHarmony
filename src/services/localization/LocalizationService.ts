import { Evented } from "../../support/Evented";

export interface LocalizationServiceProperties {
  locale?: string;
}

export interface LocalizationService extends Evented {
  locale: string;
  translate: (key: string, args?: unknown[]) => string;
}
