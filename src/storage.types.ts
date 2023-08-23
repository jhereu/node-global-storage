export type StorageCollection = Record<StorageItem["key"], StorageItem>;

export interface StorageItem<T = any> {
  key: string;
  value: T;
  protected: boolean;
  createdAt: Date;
  updatedAt: Date;
  onUpdate?(key: string, newValue: T, oldValue?: T): void;
  onDelete?(key: string, value: any): void;
}

export interface DefaultOptions {
  onUpdate?: StorageItem["onUpdate"];
  onDelete?: StorageItem["onDelete"];
  protected: StorageItem["protected"];
  force: boolean;
  silent: boolean;
  extended: boolean;
}

export interface GetOptions {
  extended?: boolean;
}

export interface SetOptions {
  onUpdate?: StorageItem["onUpdate"];
  onDelete?: StorageItem["onDelete"];
  protected?: StorageItem["protected"];
  force?: boolean;
  silent?: boolean;
}

export interface ListOptions {
  extended?: boolean;
}

export interface UnsetOptions {
  silent?: boolean;
}

export type FlushOptions = UnsetOptions;
