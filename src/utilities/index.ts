export const RECORD_PATH_SEPARATOR = "__";

export function toRecordPath(tableId: string, recordId: string): string {
  if (!tableId || !recordId) {
    throw new Error("Cannot create record path without a tableId and recordId");
  }
  return `${tableId}${RECORD_PATH_SEPARATOR}${recordId}`;
}

export function fromRecordPath(path: string): {
  tableId: string;
  recordId: string;
} {
  const pieces = path.split(RECORD_PATH_SEPARATOR);
  if (pieces.length !== 2) {
    throw new Error(`Could not parse record path: ${path}`);
  }
  const [tableId, recordId] = pieces;
  return { tableId, recordId };
}

export function clearUndefined(obj: any): void {
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) {
      delete obj[key];
    }
  }
}

export function groupBy<TItem = unknown, TGroupKey = unknown>(
  items: TItem[],
  getGroupKey: (item: TItem) => TGroupKey
): Map<TGroupKey, TItem[]> {
  const map = new Map<TGroupKey, TItem[]>();
  for (const item of items) {
    const groupKey = getGroupKey(item);
    const group = map.get(groupKey) ?? [];
    group.push(item);
    map.set(groupKey, group);
  }
  return map;
}
