import test from "node:test";
import assert from "node:assert/strict";
import { CURRENCIES, DEFAULT_CURRENCY, formatCurrency } from "../src/utils/formatCurrency.js";

test("formatCurrency formats in the requested currency", () => {
  assert.equal(formatCurrency(12.5, "USD"), "$12.50");
  assert.equal(formatCurrency(12.5, "GBP"), "£12.50");
  assert.match(formatCurrency(12.5, "EUR"), /€\s?12\.50|12,50\s?€/);
});

test("formatCurrency falls back to the default currency", () => {
  assert.equal(formatCurrency(3), formatCurrency(3, DEFAULT_CURRENCY));
  assert.equal(formatCurrency(3, "XYZ"), formatCurrency(3, DEFAULT_CURRENCY));
  assert.equal(formatCurrency("not a number", "USD"), "$0.00");
});

test("every listed currency formats without throwing", () => {
  for (const { code } of CURRENCIES) {
    assert.ok(formatCurrency(1, code).length > 0);
  }
});
