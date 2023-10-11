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

  dataService!: DataService;

  firstName: string | undefined;
  lastName: string | undefined;
  birthDate: Date | undefined;
  relationshipId: string | undefined;

  protected _tableId = "users";

  constructor(properties: UserProperties) {
    super(properties);
    if (!properties?.email || !properties.id) {
      throw new Error("Cannot construct user without Email and ID.");
    }
    this.email = properties.email;
    this.id = properties.id;
    this._recordId = this.id;
  }

  protected _getPropertyDefinitions(): PropertyDefinitions<UserProperties> {
    return {
      ...super._getPropertyDefinitions(),
      id: {
        assignProperty: false,
      },
      email: {
        assignProperty: false,
      },
      birthDate: {},
      firstName: {},
      lastName: {},
      relationshipId: {},
    };
  }
}
