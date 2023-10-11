import { DataService } from "../services/data/DataService";
import { Evented } from "./Evented";
import { clearUndefined, fromRecordPath, toRecordPath } from "../utilities";

export interface SyncableBaseProperties {
  tableId?: string;
  recordId?: string;
}

export abstract class SyncableBase<
  TProperties extends SyncableBaseProperties = SyncableBaseProperties
> extends Evented {
  abstract readonly dataService: DataService;

  get initialized(): boolean {
    return this._initialized;
  }

  readonly recordId: string | undefined;
  readonly tableId: string | undefined;

  private _initialized = false;

  constructor(properties?: TProperties) {
    super();
    this.tableId = properties?.tableId;
    this.recordId = properties?.recordId;
    properties && this.assignProperties(properties);
  }

  // Group property defs by table ID and record ID.
  protected get _recordDefs(): Map<
    string,
    { property: string; def: PropertyDef }[]
  > {
    const propertyDefs = this._getPropertyDefinitions();
    const groups = new Map<string, { property: string; def: PropertyDef }[]>();
    for (const [property, def] of [...Object.entries(propertyDefs)] as [
      string,
      PropertyDef
    ][]) {
      const key = toRecordPath(
        this.getTableId(property)!,
        this.getRecordId(property)!
      );
      const defs = groups.get(key) ?? [];
      defs.push({ property, def });
      groups.set(key, defs);
    }
    return groups;
  }

  async pull(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const [path, defs] of this._recordDefs.entries()) {
      const { recordId, tableId } = fromRecordPath(path);
      const promise = new Promise<void>(async (resolve, reject) => {
        const record = (await this.dataService.getRecord(
          tableId,
          recordId
        )) as Record<string, unknown>;
        if (!record) {
          return;
        }
        this._applyRecord(record);
        resolve();
      });
      promises.push(promise);
    }
    await Promise.all(promises);
  }

  async push(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const [path, newRecord] of Object.entries(this._exportRecords())) {
      const { recordId, tableId } = fromRecordPath(path);
      clearUndefined(newRecord);
      promises.push(this.dataService.setRecord(tableId, recordId, newRecord));
    }
    await Promise.all(promises);
  }

  assignProperties(settings: TProperties): void {
    for (const [key, val] of Object.entries(settings)) {
      const def = this._getPropertyDef(key);
      if (!def || def.assignProperty === false) {
        continue;
      } else if (def.assignProperty) {
        def.assignProperty(val);
      } else {
        (this as Record<string, unknown>)[key] = val;
      }
    }
  }

  exportProperties(): TProperties {
    const settings: any = {};
    for (const [key, def] of Object.entries(this._getPropertyDefinitions())) {
      const { exportProperty } = def as PropertyDef<unknown>;
      if (typeof exportProperty === "function") {
        settings[key] = exportProperty();
      } else if (exportProperty !== false) {
        settings[key] =
          (this as Record<string, unknown>)[key] ??
          (def as PropertyDef<unknown>).default;
      }
    }
    return settings;
  }

  getTableId(property: string): string | undefined {
    const def = this._getPropertyDef(property);
    if (!def) {
      return undefined;
    }
    const id = def.hasOwnProperty("tableId") ? def.tableId : this.tableId;
    return typeof id === "function" ? id() : id;
  }

  getRecordId(property: string): string | undefined {
    const def = this._getPropertyDef(property);
    if (!def) {
      return undefined;
    }
    const id = def.hasOwnProperty("recordId") ? def.recordId : this.recordId;
    return typeof id === "function" ? id() : id;
  }

  protected _applyRecord(record: Record<string, unknown>): void {
    const properties: any = {};
    for (const [key, val] of Object.entries(record)) {
      const def = this._getPropertyDef(key);
      properties[key] = def.fromDatabaseRecord
        ? def.fromDatabaseRecord!(val)
        : val;
    }
    this.assignProperties(properties);
  }

  protected _exportRecords(): Record<string, Record<string, unknown>> {
    const records: any = {};
    for (const [key, val] of Object.entries(this.exportProperties())) {
      const path = toRecordPath(this.getTableId(key)!, this.getRecordId(key)!);
      const record: any = records[path] ?? {};
      const def = this._getPropertyDef(key);
      record[key] = def.toDatabaseRecord ? def.toDatabaseRecord!(val) : val;
      records[path] = record;
    }
    return records;
  }

  protected _getPropertyDef<T = unknown>(property: string): PropertyDef<T> {
    return this._getPropertyDefinitions()[
      property as keyof TProperties
    ] as PropertyDef<T>;
  }

  protected _getPropertyDefinitions(): PropertyDefinitions<TProperties> {
    return {
      recordId: {
        assignProperty: false,
        exportProperty: false,
      },
      tableId: {
        assignProperty: false,
        exportProperty: false,
      },
    };
  }
}

export type PropertyDefinitions<T> = {
  [P in keyof T]?: PropertyDef<T[P]>;
};

export interface PropertyDef<TProperty = unknown, TDatabaseRecord = TProperty> {
  toDatabaseRecord?: (t: TProperty) => TDatabaseRecord;
  fromDatabaseRecord?: (t: TDatabaseRecord) => TProperty;
  exportProperty?: false | (() => TProperty);
  assignProperty?: false | ((setting: TProperty) => void);
  default?: TProperty | (() => TProperty);
  recordId?: string | (() => string);
  tableId?: string | (() => string);
}
