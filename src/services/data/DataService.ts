import { Evented } from "../../support/Evented";

export interface DataServiceProperties {}
export type RecordBase = object;

export interface DataService extends Evented {
  getRecord<TRecord extends RecordBase>(
    table: string,
    id: string
  ): Promise<TRecord | undefined>;

  setRecord<TRecord extends RecordBase>(
    table: string,
    id: string,
    data: TRecord
  ): Promise<void>;

  updateRecord<TRecord extends RecordBase>(
    table: string,
    id: string,
    data: TRecord
  ): Promise<void>;

  hasRecord(table: string, id: string): Promise<boolean>;
}
