import {
  flush,
  getAllMetadata,
  getAllValues,
  getDefaultOptions,
  getMetadata,
  getValue,
  isProtected,
  isSet,
  resetDefaultOptions,
  setDefaultOption,
  setValue,
  unsetValue,
} from "./index";

describe("Node Global Storage", () => {
  beforeEach(() => {
    flush();
  });

  describe("Set", () => {
    it("should set and get a value", () => {
      const key = "key";
      const value = "value";

      setValue(key, value);

      expect(getValue(key)).toBe(value);
    });

    it("should get an undefined value if value is not set", () => {
      const key = "key";
      expect(getValue(key)).toBeUndefined();
    });

    it("should get all stored values", () => {
      const key1 = "key1";
      const key2 = "key2";

      const value1 = "value1";
      const value2 = "value2";

      setValue(key1, value1);
      setValue(key2, value2);

      const allValues = getAllValues();

      expect(allValues).toEqual({
        [key1]: value1,
        [key2]: value2,
      });
    });

    it("should tell if a value is set", () => {
      const key = "key";
      const value = "value";

      setValue(key, value);

      expect(isSet(key)).toBe(true);
    });

    it("should tell if a value is not set", () => {
      const key = "key";

      expect(isSet(key)).toBe(false);
    });
  });

  describe("Unset", () => {
    it("should unset a value", () => {
      const key1 = "key1";
      const key2 = "key2";
      const value1 = "value1";
      const value2 = "value2";

      setValue(key1, value1);
      setValue(key2, value2);

      const fetchedValue1Before = getValue(key1);
      const fetchedValue2Before = getValue(key2);

      expect(fetchedValue1Before).toBe(value1);
      expect(fetchedValue2Before).toBe(value2);

      unsetValue(key1);

      const fetchedValue1After = getValue(key1);
      const fetchedValue2After = getValue(key2);

      expect(fetchedValue1After).toBeUndefined();
      expect(fetchedValue2After).toBe(value2);
    });

    it("should not throw if key does not exist", () => {
      const key = "key";
      expect(() => unsetValue(key)).not.toThrow();
    });

    it("should unset all values", () => {
      const key1 = "key1";
      const key2 = "key2";
      const value1 = "value1";
      const value2 = "value2";

      setValue(key1, value1);
      setValue(key2, value2);

      const fetchedValue1Before = getValue(key1);
      const fetchedValue2Before = getValue(key2);

      expect(fetchedValue1Before).toBe(value1);
      expect(fetchedValue2Before).toBe(value2);

      flush();

      const fetchedValue1After = getValue(key1);
      const fetchedValue2After = getValue(key2);

      expect(fetchedValue1After).toBeUndefined();
      expect(fetchedValue2After).toBeUndefined();
    });
  });

  describe("Protected", () => {
    it("should tell if a key is protected", () => {
      const key = "key";
      const value = "value";

      setValue(key, value, { protected: true });

      expect(isProtected(key)).toBe(true);
    });

    it("should tell if a key is not protected", () => {
      const key = "key";
      const value = "value";

      setValue(key, value);

      expect(isProtected(key)).toBe(false);
    });

    it("should tell a key is not protected if it does not exist", () => {
      const key = "key";
      expect(isProtected(key)).toBe(false);
    });

    it("should not set a protected variable unless forced", () => {
      const key = "key";
      const value = "value";
      const value2 = "value2";

      setValue(key, value, { protected: true });
      const fetchedValue1 = getValue(key);

      expect(fetchedValue1).toBe(value);

      setValue(key, value2);
      const fetchedValue2 = getValue(key);

      expect(fetchedValue2).toBe(value);

      setValue(key, value2, { force: true });
      const fetchedValue3 = getValue(key);

      expect(fetchedValue3).toBe(value2);

      setValue(key, value2, { force: false });
      const fetchedValue4 = getValue(key);

      expect(fetchedValue4).toBe(value2);
    });
  });

  describe("Metadata", () => {
    it("should get metadata of a key", () => {
      const key = "key";
      const value = "value";

      setValue(key, value);
      const metadata = getMetadata(key);

      expect(metadata).toEqual({
        value,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        protected: false,
        onUpdate: undefined,
        onDelete: undefined,
      });
    });

    it("should get undefined metadata if key does not exist", () => {
      const key = "key";
      const metadata = getMetadata(key);

      expect(metadata).toBeUndefined();
    });

    it("should get all metadata", () => {
      const key1 = "key1";
      const key2 = "key2";
      const value1 = "value1";
      const value2 = "value2";

      setValue(key1, value1);
      setValue(key2, value2);

      const metadata1 = getMetadata(key1);
      const metadata2 = getMetadata(key2);

      const allMetadata = getAllMetadata();

      expect(allMetadata).toEqual({
        [key1]: metadata1,
        [key2]: metadata2,
      });
    });
  });

  describe("Callbacks", () => {
    it("should call onUpdate callback when updated", () => {
      const key = "key";
      const value = "value";
      const value2 = "value2";

      const onUpdate = jest.fn();

      setValue(key, value, { onUpdate });
      setValue(key, value2);

      expect(onUpdate).toHaveBeenCalledWith(key, value2, value);
      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    it("should not call onUpdate callback when updated in silent mode", () => {
      const key = "key";
      const value = "value";
      const value2 = "value2";

      const onUpdate = jest.fn();

      setValue(key, value, { onUpdate });
      setValue(key, value2, { silent: true });

      expect(onUpdate).not.toHaveBeenCalled();
    });

    it("should call onDelete callback when deleted", () => {
      const key = "key";
      const value = "value";

      const onDelete = jest.fn();

      setValue(key, value, { onDelete });
      unsetValue(key);

      expect(onDelete).toHaveBeenCalledWith(key, value);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it("should not call onDelete callback when in silent mode", () => {
      const key = "key";
      const value = "value";

      const onDelete = jest.fn();

      setValue(key, value, { onDelete });
      unsetValue(key, { silent: true });

      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe("Defaults", () => {
    it("should get default options", () => {
      expect(getDefaultOptions()).toEqual({
        onUpdate: undefined,
        onDelete: undefined,
        protected: false,
        force: false,
        silent: false,
      });
    });

    it("should use default options", () => {
      const key = "key";
      const value = "value";

      setValue(key, value);

      const metadata = getMetadata(key);

      expect(metadata).toEqual({
        value,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        protected: false,
        onUpdate: undefined,
        onDelete: undefined,
      });
    });

    it("should set default options", () => {
      const key = "key";
      const value = "value";

      const onUpdate = jest.fn();
      const onDelete = jest.fn();

      setDefaultOption("onUpdate", onUpdate);
      setDefaultOption("onDelete", onDelete);
      setDefaultOption("protected", true);

      setValue(key, value);

      const metadata = getMetadata(key);

      expect(metadata).toEqual({
        value,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        protected: true,
        onUpdate,
        onDelete,
      });
    });

    it("should reset default options", () => {
      const key2 = "key1";
      const key1 = "key2";
      const value1 = "value1";
      const value2 = "value2";

      const onUpdate = jest.fn();
      const onDelete = jest.fn();

      setDefaultOption("onUpdate", onUpdate);
      setDefaultOption("onDelete", onDelete);
      setDefaultOption("protected", true);

      setValue(key1, value1);

      const metadata = getMetadata(key1);

      expect(metadata).toEqual({
        value: value1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        protected: true,
        onUpdate,
        onDelete,
      });

      resetDefaultOptions();

      setValue(key2, value2);

      const metadata2 = getMetadata(key2);

      expect(metadata2).toEqual({
        value: value2,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        protected: false,
        onUpdate: undefined,
        onDelete: undefined,
      });
    });
  });
});
