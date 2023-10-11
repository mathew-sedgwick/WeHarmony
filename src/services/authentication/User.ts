import {
  PropertyDefinitions,
  SyncableBase,
  SyncableBaseProperties,
} from "../../support/Syncable";
import { DataService } from "../data/DataService";

export interface UserProperties extends SyncableBaseProperties {
  email?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  relationshipId?: string;
}

export class User extends SyncableBase<UserProperties> {
  readonly email: string;
  readonly id: string;
  readonly tableId = "users";

  dataService!: DataService;

  firstName: string | undefined;
  lastName: string | undefined;
  birthDate: Date | undefined;
  relationshipId: string | undefined;

  constructor(properties: UserProperties) {
    super(properties);
    if (!properties?.email || !properties.id) {
      throw new Error("Cannot construct user without Email and ID.");
    }
    this.email = properties.email;
    this.id = properties.id;
  }

  protected _getPropertyDefinitions(): PropertyDefinitions<UserProperties> {
    return {
      ...super._getPropertyDefinitions(),
      id: {
        assignProperty: false,
        exportProperty: false,
      },
      email: {
        assignProperty: false,
        exportProperty: false,
      },
      birthDate: {},
      firstName: {},
      lastName: {},
      relationshipId: {},
    };
  }
}
