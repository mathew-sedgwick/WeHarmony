import { Evented } from "../../support/Evented";
import {
  LocalizationService,
  LocalizationServiceProperties,
} from "./LocalizationService";
import InvKeys from "./inv.json";

export interface DefaultLocalizationProperties
  extends LocalizationServiceProperties {}

export class DefaultLocalizationService
  extends Evented
  implements LocalizationService
{
  locale: string;

  constructor(properties?: DefaultLocalizationProperties) {
    super();
    this.locale = properties?.locale ?? "inv";
  }
  translate(key: string, args?: unknown[]): string {
    return stubTranslate(key, args);
  }
}

function stubTranslate(key: string, args?: unknown[]): string {
  // TODO
  return (InvKeys as Record<string, string>)[key] ?? key;
}
