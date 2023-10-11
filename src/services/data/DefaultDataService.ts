import { FIRESTORE_DB } from "firebaseConfig";

import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { Evented } from "src/support/Evented";
import { RecordBase } from "./DataService";

export interface DefaultDataServiceProperties {}

export class DefaultDataService extends Evented {
  constructor(properties?: DefaultDataServiceProperties) {
    super();
  }
  async getRecord<TRecord extends RecordBase>(
    table: string,
    id: string
  ): Promise<TRecord | undefined> {
    const docRef = doc(FIRESTORE_DB, table, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as TRecord;
    } else {
      return undefined;
    }
  }

  async setRecord<TRecord extends RecordBase>(
    table: string,
    id: string,
    data: TRecord
  ): Promise<void> {
    const docRef = doc(FIRESTORE_DB, table, id);
    await setDoc(docRef, data);
  }

  async updateRecord<TRecord extends RecordBase>(
    table: string,
    id: string,
    data: TRecord
  ): Promise<void> {
    const docRef = doc(FIRESTORE_DB, table, id);
    await updateDoc(docRef, data);
  }

  async hasRecord(table: string, id: string): Promise<boolean> {
    const docRef = doc(FIRESTORE_DB, table, id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  }
}
