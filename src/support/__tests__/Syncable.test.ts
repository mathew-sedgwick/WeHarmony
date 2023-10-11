import { DataService } from "../../services/data/DataService";
import {
  PropertyDefinitions,
  SyncableBase,
  SyncableBaseProperties,
} from "../Syncable";
import { Evented } from "../Evented";
import { toRecordPath } from "../../utilities";

describe("constructor()", () => {
  it("assigns properties to the class instance that are specified in the property definitions", () => {
    const subject = new TestSyncable({ foo: 2 });

    expect(subject.foo).toBe(2);
  });
});

describe("assignProperties()", () => {
  it("assigns properties to the class instance that are specified in the property definitions", () => {
    const subject = new TestSyncable();

    subject.assignProperties({ foo: 2 });

    expect(subject.foo).toBe(2);
  });

  it("assigns properties to the class instance using the PropertyDef.assignProperties callback", () => {
    const subject = new TestSyncable();

    subject.assignProperties({ baz: '{"cat":"meow"}' });

    expect(subject.baz?.cat).toBe("meow");
  });

  it("does not assign properties to the class instance when PropertyDef.assignProperties is false", () => {
    const subject = new TestSyncable();

    subject.assignProperties({ bar: "NEW BAR" });

    expect(subject.bar).not.toBe("NEW BAR");
  });

  it("does not assign properties to the class instance that are not specified in the property definitions", () => {
    const subject = new TestSyncable();

    subject.assignProperties({ notIncluded: 2 } as any);

    expect((subject as any).notIncluded).toBe(undefined);
  });
});
describe("exportProperties()", () => {
  it("exports properties from the class instance that are specified in the property definitions", () => {
    const subject = new TestSyncable({ foo: 2 });

    const result = subject.exportProperties();

    expect(result.foo).toBe(2);
  });

  it("assigns properties to the class instance using the PropertyDef.assignProperties callback", () => {
    const subject = new TestSyncable({ baz: '{"cat":"meow"}' });

    const result = subject.exportProperties();

    expect(result.baz).toBe('{"cat":"meow"}');
  });

  it("does not assign properties to the class instance when PropertyDef.assignProperties is false", () => {
    const subject = new TestSyncable({ bar: "NEW BAR" });

    const result = subject.exportProperties();

    expect(Object.hasOwnProperty("bar")).toBe(false);
  });

  it("exports the PropertyDef.default value if not set on the class instance", () => {
    const subject = new TestSyncable();

    const result = subject.exportProperties();

    expect(result.foo).toBe(1);
  });

  it("does not export properties from the class instance that are not specified in the property definitions", () => {
    const subject = new TestSyncable();
    (subject as any).notIncluded = true;

    const result = subject.exportProperties();

    expect(result.hasOwnProperty("notIncluded")).toBe(false);
  });
});
describe("getTableId()", () => {
  it("returns the table ID for a given property, if one is specified by the property definitions", () => {
    const subject = new TestSyncable();

    const tableId = subject.getTableId("baz");

    expect(tableId).toBe("baz-table");
  });
  it("returns the Syncable's tableId, if one is not specific by the property definitions", () => {
    const subject = new TestSyncable();

    const tableId = subject.getTableId("foo");

    expect(tableId).toBe("test-table");
  });
  it("returns undefined, if the property does not have a corresponding property definition", () => {
    const subject = new TestSyncable();

    const tableId = subject.getTableId("not-included");

    expect(tableId).toBe(undefined);
  });
});
describe("getRecordId()", () => {
  it("returns the record ID for a given property, if one is specified by the property definitions", () => {
    const subject = new TestSyncable();

    const recordId = subject.getRecordId("baz");

    expect(recordId).toBe("baz-record");
  });
  it("returns the Syncable's tableId, if one is not specific by the property definitions", () => {
    const subject = new TestSyncable();

    const recordId = subject.getRecordId("foo");

    expect(recordId).toBe("test-record");
  });
  it("returns undefined, if the property does not have a corresponding property definition", () => {
    const subject = new TestSyncable();

    const recordId = subject.getRecordId("not-included");

    expect(recordId).toBe(undefined);
  });
});
describe("push()", () => {
  it("sets a record for each table and record ID pair associated with the instance's properties", async () => {
    const subject = new ComplexTestSyncable({
      basePropA: "baseA",
      basePropB: "baseB",
      nestedPropA1: "nestedA1",
      nestedPropA2: "nestedA2",
      nestedPropB1: "nestedB1",
      nestedPropB2: "nestedB2",
    });

    await subject.push();

    expect(
      Object.keys(
        subject.dataService.__mockRecords.get("base-table__base-record") as any
      ).length
    ).toBe(2);
    expect(
      Object.keys(
        subject.dataService.__mockRecords.get("nested-table__a-record") as any
      ).length
    ).toBe(2);
    expect(
      Object.keys(
        subject.dataService.__mockRecords.get("nested-table__b-record") as any
      ).length
    ).toBe(2);
  });
});
describe("pull()", () => {
  it("assigns properties to the instance", async () => {
    const subject = new ComplexTestSyncable();

    subject.dataService.__mockRecords.set("base-table__base-record", {
      basePropA: "baseA",
      basePropB: "baseB",
    });
    subject.dataService.__mockRecords.set("nested-table__a-record", {
      nestedPropA1: "nestedA1",
      nestedPropA2: "nestedA2",
    });
    subject.dataService.__mockRecords.set("nested-table__b-record", {
      nestedPropB1: "nestedB1",
      nestedPropB2: "nestedB2",
    });

    await subject.pull();

    expect(subject.basePropA).toBe("baseA");
    expect(subject.basePropB).toBe("baseB");
    expect(subject.nestedPropA1).toBe("nestedA1");
    expect(subject.nestedPropA2).toBe("nestedA2");
    expect(subject.nestedPropB1).toBe("nestedB1");
    expect(subject.nestedPropB2).toBe("nestedB2");
  });
});

interface TestSyncableProperties extends SyncableBaseProperties {
  foo?: number;
  bar?: string;
  baz?: string;
}

class MockDataService extends Evented implements DataService {
  __mockRecords = new Map<string, Record<string, unknown>>();

  async getRecord<TRecord extends object>(
    table: string,
    id: string
  ): Promise<TRecord | undefined> {
    return this.__mockRecords.get(toRecordPath(table, id)) as TRecord;
  }
  async hasRecord(table: string, id: string): Promise<boolean> {
    return this.__mockRecords.has(toRecordPath(table, id));
  }
  async setRecord<TRecord extends object>(
    table: string,
    id: string,
    data: TRecord
  ): Promise<void> {
    this.__mockRecords.set(toRecordPath(table, id), data as any);
  }
  async updateRecord<TRecord extends object>(
    table: string,
    id: string,
    data: TRecord
  ): Promise<void> {
    this.__mockRecords.set(toRecordPath(table, id), data as any);
  }
}

class TestSyncable extends SyncableBase<TestSyncableProperties> {
  dataService = new MockDataService();
  foo: number | undefined;
  bar: number | undefined;
  baz: any | undefined;
  protected _recordId = "test-record";
  protected _tableId = "test-table";
  protected _getPropertyDefinitions(): PropertyDefinitions<TestSyncableProperties> {
    return {
      ...super._getPropertyDefinitions(),
      foo: {
        default: 1,
      },
      bar: {
        assignProperty: false,
        exportProperty: false,
      },
      baz: {
        assignProperty: (setting) =>
          (this.baz = setting ? JSON.parse(setting) : undefined),
        exportProperty: () => (this.baz ? JSON.stringify(this.baz) : undefined),
        tableId: "baz-table",
        recordId: "baz-record",
      },
    };
  }
}

interface ComplexTestSyncableProperties extends SyncableBaseProperties {
  basePropA: string;
  basePropB: string;
  nestedPropA1: string;
  nestedPropA2: string;
  nestedPropB1: string;
  nestedPropB2: string;
}

class ComplexTestSyncable extends SyncableBase<ComplexTestSyncableProperties> {
  protected _recordId = "base-record";
  protected _tableId = "base-table";

  basePropA: string | undefined;
  basePropB: string | undefined;
  nestedPropA1: string | undefined;
  nestedPropA2: string | undefined;
  nestedPropB1: string | undefined;
  nestedPropB2: string | undefined;

  dataService = new MockDataService();

  protected _getPropertyDefinitions(): PropertyDefinitions<ComplexTestSyncableProperties> {
    return {
      ...super._getPropertyDefinitions(),
      basePropA: {},
      basePropB: {},
      nestedPropA1: { recordId: "a-record", tableId: "nested-table" },
      nestedPropA2: { recordId: "a-record", tableId: "nested-table" },
      nestedPropB1: { recordId: "b-record", tableId: "nested-table" },
      nestedPropB2: { recordId: "b-record", tableId: "nested-table" },
    };
  }
}
