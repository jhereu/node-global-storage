import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { flush, isProtected, isSet, list, set, unset } from "./storage.lib";

const restartStorage = () => flush({ silent: true });

describe("SET function", () => {
  it("Sets a value with default parameters and returns it", () => {
    restartStorage();

    const key = "myKey";
    const value = "This is my value";

    const result = set(key, value);
    const expectedResult = value;

    assert.strictEqual(expectedResult, result);
  });

  it("Sets a protected value and returns it", () => {
    restartStorage();

    const key = "myKey";
    const value = "This is my protected value";

    const result = set(key, value, { protected: true });
    const expectedResult = value;

    assert.strictEqual(expectedResult, result);
  });

  it("Does not overwrite a protected value without being forced", () => {
    restartStorage();

    const key = "myKey";

    const oldValue = "This is my protected value";
    const newValue = "This is my overwritten value";

    set(key, oldValue, { protected: true });

    const result = set(key, newValue);
    const expectedResult = oldValue;

    assert.strictEqual(expectedResult, result);
  });

  it("Does overwrite a protected value when forced", () => {
    restartStorage();

    const key = "myKey";

    const oldValue = "This is my protected value";
    const newValue = "This is my overwritten value";

    set(key, oldValue, { protected: true });

    const result = set(key, newValue, { force: true });
    const expectedResult = newValue;

    assert.strictEqual(expectedResult, result);
  });
});

describe("LIST function", () => {
  it("Lists all values without options or callbacks", () => {
    restartStorage();

    const key1 = "key_1";
    const value1 = "value_1";
    set(key1, value1);

    const key2 = "key_2";
    const value2 = "value_2";
    set(key2, value2);

    const result = list();

    const expectedResult = {
      [key1]: value1,
      [key2]: value2,
    };

    assert.deepStrictEqual(result, expectedResult);
  });

  it("Lists all values values with extended data", () => {
    restartStorage();

    const key1 = "key_1";
    const value1 = "value_1";
    const onUpdate1 = () => 1;

    set(key1, value1, { onUpdate: onUpdate1 });

    const key2 = "key_2";
    const value2 = "value_2";
    set(key2, value2);

    const listedValues = list({ extended: true });

    const result = Boolean(listedValues[key1].onUpdate);
    const expectedResult = true;

    assert.strictEqual(result, expectedResult);
  });
});

describe("isSet function", () => {
  it("Returns true when a key is set", () => {
    restartStorage();

    const key1 = "key_1";
    const value1 = "value_1";

    set(key1, value1);

    const result = isSet(key1);
    const expectedResult = true;

    assert.strictEqual(result, expectedResult);
  });

  it("Returns false when a key is not set", () => {
    restartStorage();

    const key1 = "key_1";
    const value1 = "value_1";

    set(key1, value1);

    const key2 = "key_2";

    const result = isSet(key2);
    const expectedResult = false;

    assert.strictEqual(result, expectedResult);
  });
});

describe("UNSET function", () => {
  it("Unsets a value that exists", () => {
    restartStorage();

    const key1 = "key_1";
    const value1 = "value_1";

    set(key1, value1);
    unset(key1);

    const result = isSet(key1);
    const expectedResult = false;

    assert.strictEqual(result, expectedResult);
  });

  it("Unsets a value that does not exists without crashing", () => {
    restartStorage();

    const key1 = "key_1";
    unset(key1);

    const result = isSet(key1);
    const expectedResult = false;

    assert.strictEqual(result, expectedResult);
  });
});

describe("FLUSH function", () => {
  it("Flushes all values", () => {
    const key1 = "key_1";
    const value1 = "value_1";

    set(key1, value1);

    const key2 = "key_2";
    const value2 = "value_2";

    set(key2, value2);

    flush();

    const result = !isSet(key1) && !isSet(key2);
    const expectedResult = true;

    assert.strictEqual(result, expectedResult);
  });
});

describe("isProtected function", () => {
  it("Returns true when a key is protected", () => {
    restartStorage();

    const key1 = "key_1";
    const value1 = "value_1";

    set(key1, value1, { protected: true });

    const result = isProtected(key1);
    const expectedResult = true;

    assert.strictEqual(result, expectedResult);
  });

  it("Returns false when a key is not protected", () => {
    restartStorage();

    const key1 = "key_1";
    const value1 = "value_1";

    set(key1, value1);

    const result = isProtected(key1);
    const expectedResult = false;

    assert.strictEqual(result, expectedResult);
  });
});
