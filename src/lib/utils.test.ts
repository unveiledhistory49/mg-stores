import { describe, expect, it } from "vitest";
import { cn, formatMoney, formatNaira } from "./utils";

describe("cn", () => {
  it("joins truthy classes with a single space", () => {
    expect(cn("a", "b", undefined, null, false, "", "c")).toBe("a b c");
  });

  it("passes a single class through unchanged", () => {
    expect(cn("px-4")).toBe("px-4");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(undefined, null, false, "")).toBe("");
  });
});

describe("formatNaira", () => {
  it("formats a whole naira amount with thousands separators and no decimals", () => {
    expect(formatNaira(3500)).toBe("₦3,500");
  });

  it("formats a large amount with the naira symbol", () => {
    expect(formatNaira(1234567)).toBe("₦1,234,567");
  });

  it("keeps up to two decimals for fractional amounts", () => {
    const result = formatNaira(1234567.5);
    expect(result).toContain("1,234,567.5");
    expect(result).not.toContain("1,234,567.50");
  });

  it("formats zero without a minus sign", () => {
    expect(formatNaira(0)).toBe("₦0");
  });

  it("prefixes negative amounts with a minus sign", () => {
    expect(formatNaira(-500)).toBe("-₦500");
  });
});

describe("formatMoney", () => {
  it("uses the provided currency code", () => {
    expect(formatMoney(99, "USD")).toBe("$99");
  });

  it("defaults to naira when no currency is given", () => {
    expect(formatMoney(250)).toBe("₦250");
  });
});