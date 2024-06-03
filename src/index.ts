/**
 * @name StorageCollection
 * @description Internal collection of stored data
 */
export type StorageCollection = Map<string, StorageItem>;

/**
 * @name StorageItem
 * @description Internal data structure for stored data
 */
export interface StorageItem<T = unknown> {
  /**
   * Stored value
   */
  value: T;
  /**
   * Protect the value from being deleted if set again
   */
  protected: boolean;
  /**
   * Date of creation of the key/value pair
   */
  createdAt: Date;
  /**
   * Date of the last update of the key/value pair
   */
  updatedAt: Date;
  /**
   * @name onUpdate
   * @description Callback to execute when the value is updated
   * @param {string} key - Key of the updated value
   * @param {T} newValue - New value
   * @param {T} oldValue - Old value (if exists)
   * @return {void}
   */
  onUpdate?(key: string, newValue: T, oldValue?: T): void;
  /**
   * @name onDelete
   * @description Callback to execute when the value is deleted
   * @param {string} key - Key of the deleted value
   * @param {T} value - Deleted value
   * @return {void}
   */
  onDelete?(key: string, value: T): void;
}

/**
 * @name DefaultOptions
 * @description Default options for all transactions
 */
export interface DefaultOptions {
  /**
   * @see {@link StorageItem.onUpdate}
   */
  onUpdate?: StorageItem["onUpdate"];
  /**
   * @see {@link StorageItem.onDelete}
   */
  onDelete?: StorageItem["onDelete"];
  /**
   * @see {@link StorageItem.protected}
   */
  protected: StorageItem["protected"];
  /**
   * Force the update of the value even if it is protected
   */
  force: boolean;
  /**
   * Do not execute the onUpdate or onDelete callback of previous data if set
   */
  silent: boolean;
}

/**
 * @name SetOptions
 * @description Options for the `set` transaction
 */
export interface SetOptions {
  /**
   * @see {@link StorageItem.onUpdate}
   */
  onUpdate?: StorageItem["onUpdate"];
  /**
   * @see {@link StorageItem.onDelete}
   */
  onDelete?: StorageItem["onDelete"];
  /**
   * @see {@link StorageItem.protected}
   */
  protected?: StorageItem["protected"];
  /**
   * @see {@link DefaultOptions.force}
   */
  force?: boolean;
  /**
   * @see {@link DefaultOptions.silent}
   */
  silent?: boolean;
}

/**
 * @name UnsetOptions
 * @description Options for the `unset` transaction
 */
export interface UnsetOptions {
  /**
   * @see {@link DefaultOptions.silent}
   */
  silent?: boolean;
}

/**
 * @name FlushOptions
 * @description Options for the `flush` transaction
 * @see {@link UnsetOptions}
 */
export interface FlushOptions {
  /**
   * @see {@link DefaultOptions.silent}
   */
  silent?: boolean;
}

/**
 * Core storage object where data is stored
 */
const datastore: StorageCollection = new Map<string, StorageItem>();

/**
 * Default parameters to use for all transactions.
 * It can be overridden by using the {@link setDefaultOption} function and
 * reset to the initial values by using the {@link resetDefaultOptions} function.
 */
const initialDefaultOptions: DefaultOptions = {
  protected: false,
  force: false,
  onUpdate: undefined,
  onDelete: undefined,
  silent: false,
};

/**
 * Default options for all transactions
 */
let defaultOptions: DefaultOptions = {
  ...initialDefaultOptions,
};

/**
 * @private
 * @name getStorageItem
 * @description Returns the storage item for the provided key name
 * @param {string} key - Key name to get the data from
 * @return {StorageItem} - Storage item
 */
function getStorageItem<T = unknown>(key: string) {
  return datastore.get(key) as StorageItem<T> | undefined;
}

/**
 * @name getValue
 * @description Returns the value for the provided key name
 * @param {string} key - Key name to store the data to
 * @param {GetOptions} options - Options for the transaction
 * @return {T} - Stored value
 * @example
 * ```typescript
 * const key = "myKey";
 * const value = "myValue";
 *
 * setValue(key, value);
 *
 * const storedValue = getValue(key); // "myValue"
 * ```
 */
export function getValue<T = unknown>(key: string) {
  return getStorageItem<T>(key)?.value;
}

/**
 * @name getMetadata
 * @description Returns the full {@link StorageItem} of the provided key name
 * @param {string} key - Key name to get the StorageItem from
 * @return {StorageItem} - Storage item
 * @example
 * ```typescript
 * const key = "myKey";
 * const value = "myValue";
 *
 * setValue(key, value);
 *
 * const metadata = getMetadata(key); // { value: "myValue", createdAt: Date, updatedAt: Date, protected: false, onUpdate: undefined, onDelete: undefined }
 * ```
 */
export function getMetadata<T = unknown>(
  key: string
): StorageItem<T> | undefined {
  return getStorageItem<T>(key);
}

/**
 * @name setValue<T>
 * @description Sets the value for a given key in the global storage.
 * @param {sting} key - Key to set the value for
 * @param {T} value - Value to set
 * @param {SetOptions} options - Optional settings for the operation
 * @return {T} Value that was set
 * @example
 * ```typescript
 * const key = "myKey";
 * const value = "myValue";
 *
 * setValue(key, value);
 *
 * const storedValue = getValue(key); // "myValue"
 * ```
 */
export function setValue<T = unknown>(
  key: string,
  value: T,
  options?: SetOptions
) {
  const item = getStorageItem<T>(key) || ({} as StorageItem<T>);
  const force = options?.force ?? defaultOptions.force;
  const silent = options?.silent ?? defaultOptions.silent;

  if (item.protected && !force) {
    return item.value;
  }

  if (item.onUpdate && !silent) {
    item.onUpdate(key, value, item.value);
  }

  item.value = value;
  item.protected = options?.protected ?? defaultOptions.protected;
  item.onUpdate ||= options?.onUpdate ?? defaultOptions.onUpdate;
  item.onDelete ||= options?.onDelete ?? defaultOptions.onDelete;

  const now = new Date();
  item.createdAt ||= now;
  item.updatedAt = now;

  datastore.set(key, item);

  return value;
}

/**
 * @name getAllValues
 * @description Returns all stored values
 * @return {Record<string, unknown>} - All stored values
 * @example
 * ```typescript
 * const key1 = "key1";
 * const key2 = "key2";
 * const value1 = "value1";
 * const value2 = "value2";
 *
 * setValue(key1, value1);
 * setValue(key2, value2);
 *
 * const allValues = getAllValues(); // { key1: "value1", key2: "value2" }
 * ```
 */
export function getAllValues() {
  return Array.from(datastore).reduce(
    (memo, [key, storageItem]) => ({ ...memo, [key]: storageItem.value }),
    {} as Record<string, unknown>
  );
}

/**
 * @name getAllMetadata
 * @description Returns all stored metadata
 * @return {Record<string, StorageItem>} - All stored metadata
 * @example
 * ```typescript
 * const key1 = "key1";
 * const key2 = "key2";
 * const value1 = "value1";
 * const value2 = "value2";
 *
 * setValue(key1, value1);
 * setValue(key2, value2);
 *
 * const allMetadata = getAllMetadata(); // { key1: { value: "value1", createdAt: Date, updatedAt: Date, protected: false, onUpdate: undefined, onDelete: undefined }, key2: { value: "value2", createdAt: Date, updatedAt: Date, protected: false, onUpdate: undefined, onDelete: undefined } }
 * ```
 */
export function getAllMetadata() {
  return Array.from(datastore).reduce(
    (memo, [key, storageItem]) => ({ ...memo, [key]: storageItem }),
    {} as Record<string, StorageItem>
  );
}

/**
 * @name isSet
 * @description Checks if a key has been set
 * @param {string} key - Key to check
 * @return {boolean} - Whether the key has been set
 * @example
 * ```typescript
 * const key1 = "myKey1";
 * const key2 = "myKey2";
 * const value1 = "myValue1";
 *
 * setValue(key1, value1);
 *
 * const isKey1Set = isSet(key1); // true
 * const isKey2Set = isSet(key2); // false
 * ```
 */
export function isSet(key: string) {
  return datastore.has(key);
}

/**
 * @name unsetValue
 * @description Removes the value for a given key in the global storage.
 * It triggers the `onDelete` callback if it exists unless the `silent` option is set to `true`.
 * @param {sting} key - Key to set the value for
 * @param {T} value - Value to set
 * @param {SetOptions} options - Optional settings for the operation
 * @return {T} Value that was set
 * @example
 * ```typescript
 * const key = "myKey";
 * const value = "myValue";
 *
 * setValue(key, value);
 *
 * const storedValue = getValue(key); // "myValue"
 *
 * unsetValue(key);
 *
 * const storedValue = getValue(key); // undefined
 * ```
 */
export function unsetValue(key: string, options?: UnsetOptions) {
  const item = getStorageItem(key);

  if (!item) {
    return;
  }

  const silent = options?.silent ?? defaultOptions.silent;

  if (!silent && item.onDelete) {
    item.onDelete(key, item.value);
  }

  datastore.delete(key);
}

/**
 * @name flush
 * @description Unsets all stored values
 * @param {FlushOptions} options - Optional settings for the operation
 * @return {void}
 * @example
 * ```typescript
 * const key1 = "key1";
 * const key2 = "key2";
 * const value1 = "value1";
 * const value2 = "value2";
 *
 * setValue(key1, value1);
 * setValue(key2, value2);
 *
 * const allValuesBefore = getAllValues(); // { key1: "value1", key2: "value2" }
 *
 * flush();
 *
 * const allValuesAfter = getAllValues(); // {}
 * ```
 */
export function flush(options?: FlushOptions) {
  for (const key of datastore.keys()) {
    unsetValue(key, options);
  }
}

/**
 * @name isProtected
 * @description Checks if a key is protected
 * @param {string} key - Key to check
 * @return {boolean} - Whether the key is protected
 * @example
 * ```typescript
 * const key1 = "myKey1";
 * const value1 = "myValue2";
 * const protected1 = true;
 *
 * setValue(key1, value1, { protected: protected1 });
 * const isKey1Protected = isProtected(key1); // true
 *
 * const key2 = "myKey2";
 * const value2 = "myValue2";
 * const protected2 = false;
 *
 * setValue(key2, value2, { protected: protected2 });
 *
 * const isKey2Protected = isProtected(key2); // false
 * ```
 */
export function isProtected(key: string) {
  return Boolean(getStorageItem(key)?.protected);
}

/**
 * @name setDefaultOption
 * @description Sets the default option for all transactions
 * @param {keyof DefaultOptions} key - Option to set
 * @param {DefaultOptions[keyof DefaultOptions]} value - Value to set
 * @return {void}
 * @example
 * ```typescript
 * setDefaultOption("protected", true);
 *
 * const key = "myKey";
 * const value = "myValue";
 *
 * setValue(key, value);
 *
 * const isKeyProtected = isProtected(key); // true
 * ```
 */
export function setDefaultOption<T extends keyof DefaultOptions>(
  key: T,
  value: DefaultOptions[T]
) {
  defaultOptions[key] = value;
}

/**
 * @private
 * @name resetDefaultOptions
 * @description Resets the default options to the initial default values
 * @return {void}
 * @example
 * ```typescript
 * setDefaultOption("protected", true);
 *
 * const key1 = "myKey1";
 * const value1 = "myValue1";
 *
 * setValue(key1, value1);
 *
 * const isKey1Protected = isProtected(key1); // true
 *
 * resetDefaultOptions();
 *
 * const key2 = "myKey2";
 * const value2 = "myValue2";
 *
 * setValue(key2, value2);
 *
 * const isKey2Protected = isProtected(key2); // false
 * ```
 */
export function resetDefaultOptions() {
  defaultOptions = { ...initialDefaultOptions };
}

/**
 * @name getDefaultOptions
 * @description Returns the default options
 * @return {DefaultOptions} - Default options
 * @example
 * ```typescript
 * const defaultOptions = getDefaultOptions(); // { protected: false, force: false, onUpdate: undefined, onDelete: undefined, silent: false }
 * ```
 */
export function getDefaultOptions() {
  return { ...defaultOptions };
}
