import type {
  UnsetOptions,
  GetOptions,
  ListOptions,
  SetOptions,
  StorageCollection,
  StorageItem,
  FlushOptions,
  DefaultOptions,
} from "./storage.types";

/**
 * Core storage object
 */
const __storage: StorageCollection = {};

/**
 * Default parameters
 */
const __options: DefaultOptions = {
  protected: false,
  force: false,
  onUpdate: undefined,
  onDelete: undefined,
  silent: false,
  extended: false,
};

/**
 * @name get
 * @description Stores data with a given key name and returns the stored value
 */
export function get<T = any>(key: StorageItem["key"], options?: GetOptions) {
  const record = __storage[key] as StorageItem<T>;

  const computedExtended = options?.extended ?? __options.extended;

  return computedExtended ? record : record?.value;
}

/**
 * @name set
 * @description Returns the value of the provided key name
 */
export function set<T = any>(
  key: StorageItem["key"],
  value: T,
  options?: SetOptions,
) {
  const item = (__storage[key] as StorageItem<T>) || {};

  const computedForced = options?.force ?? __options.force;

  if (item?.protected && !computedForced) {
    return item.value;
  }

  const computedSilent = options?.silent ?? __options.silent;

  if (item?.onUpdate && !computedSilent) {
    item.onUpdate(key, value, item.value);
  }

  item.key = key;
  item.value = value;
  item.protected = options?.protected ?? __options.protected;
  item.onUpdate ||= options?.onUpdate ?? __options.onUpdate;
  item.onDelete ||= options?.onDelete ?? __options.onDelete;

  const now = new Date();
  item.createdAt ||= now;
  item.updatedAt = now;

  __storage[key] = item;

  return value;
}

/**
 * @name list
 * @description Returns all stored data so far. If passed `{extended: true}`, returns also specific options for the given key
 */
export function list(options?: ListOptions) {
  const computedExtended = options?.extended ?? __options.extended;

  if (computedExtended) {
    return __storage;
  }

  return Object.entries(__storage).reduce(
    (memo, [key, storageItem]) => {
      memo[key] = storageItem.value;
      return memo;
    },
    {} as Record<string, any>,
  );
}

/**
 * @name isSet
 * @description Checks if a key exists. If existed but already deleted, returns `false`.
 */
export function isSet(key: string) {
  return __storage.hasOwnProperty(key);
}

/**
 * @name unset
 * @description Deletes the data stored with the given name
 */
export function unset(key: string, options?: UnsetOptions) {
  if (!isSet(key)) {
    return;
  }

  const value = __storage[key];

  const computedSilent = options?.silent ?? __options.silent;

  if (!computedSilent && value.onDelete) {
    value.onDelete(key, value);
  }

  delete __storage[key];
}

/**
 * @name flush
 * @description Deletes all stored data
 */
export function flush(options?: FlushOptions) {
  for (const key of Object.keys(__storage)) {
    unset(key, options);
  }

  return undefined;
}

/**
 * @name isProtected
 * @description Checks if a key was stored with protection (cannot delete except if `force: true` is specified).
 */
export function isProtected(key: string) {
  if (!isSet(key)) {
    return false;
  }

  return Boolean(__storage[key].protected);
}

/**
 * @name default
 * @description Override default specific options for all transactions
 */
export function defaultOption<T extends keyof DefaultOptions>(
  key: T,
  value: DefaultOptions[T],
) {
  __options[key] = value;
}
