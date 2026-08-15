"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useRegion } from "@/components/providers/region-provider";
import { Button } from "@/components/ui/button";

type ShippingFormData = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
};

type ShippingInformationStepProps = {
  onSubmit: (data: ShippingFormData) => Promise<void>;
  isSubmitting: boolean;
};

const inputClasses =
  "h-12 w-full rounded-lg border border-stone-300 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20";

export function ShippingInformationStep({
  onSubmit,
  isSubmitting,
}: ShippingInformationStepProps) {
  const { cart } = useCart();
  const { region } = useRegion();

  const countries = region?.countries ?? cart?.region?.countries ?? [];
  const initialCountry = countries[0]?.iso_2 ?? "";

  const [form, setForm] = useState<ShippingFormData>({
    email: cart?.email ?? "",
    first_name: cart?.shipping_address?.first_name ?? "",
    last_name: cart?.shipping_address?.last_name ?? "",
    phone: cart?.shipping_address?.phone ?? "",
    address_1: cart?.shipping_address?.address_1 ?? "",
    address_2: cart?.shipping_address?.address_2 ?? "",
    city: cart?.shipping_address?.city ?? "",
    province: cart?.shipping_address?.province ?? "",
    postal_code: cart?.shipping_address?.postal_code ?? "",
    country_code:
      cart?.shipping_address?.country_code ?? initialCountry,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const update = (key: keyof ShippingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof ShippingFormData, string>> = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.first_name.trim()) nextErrors.first_name = "Required.";
    if (!form.last_name.trim()) nextErrors.last_name = "Required.";
    if (!form.address_1.trim()) nextErrors.address_1 = "Required.";
    if (!form.city.trim()) nextErrors.city = "Required.";
    if (!form.country_code) nextErrors.country_code = "Select a country.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    void onSubmit(form);
  };

  const labelFor = (key: string) => (
    <label
      htmlFor={key}
      className="mb-1 block text-sm font-medium text-stone-700"
    >
      {key === "address_1"
        ? "Address"
        : key === "address_2"
          ? "Apartment, suite, etc. (optional)"
          : key
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
    </label>
  );

  const errorText = (key: keyof ShippingFormData) =>
    errors[key] ? (
      <p role="alert" className="mt-1 text-xs text-red-600">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div>
          {labelFor("email")}
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClasses}
            placeholder="you@example.com"
          />
          {errorText("email")}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            {labelFor("first_name")}
            <input
              id="first_name"
              autoComplete="given-name"
              value={form.first_name}
              onChange={(event) => update("first_name", event.target.value)}
              className={inputClasses}
            />
            {errorText("first_name")}
          </div>
          <div>
            {labelFor("last_name")}
            <input
              id="last_name"
              autoComplete="family-name"
              value={form.last_name}
              onChange={(event) => update("last_name", event.target.value)}
              className={inputClasses}
            />
            {errorText("last_name")}
          </div>
        </div>

        <div>
          {labelFor("phone")}
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClasses}
            placeholder="+234 ..."
          />
        </div>

        <div>
          {labelFor("address_1")}
          <input
            id="address_1"
            autoComplete="address-line1"
            value={form.address_1}
            onChange={(event) => update("address_1", event.target.value)}
            className={inputClasses}
          />
          {errorText("address_1")}
        </div>

        <div>
          {labelFor("address_2")}
          <input
            id="address_2"
            autoComplete="address-line2"
            value={form.address_2}
            onChange={(event) => update("address_2", event.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            {labelFor("city")}
            <input
              id="city"
              autoComplete="address-level2"
              value={form.city}
              onChange={(event) => update("city", event.target.value)}
              className={inputClasses}
            />
            {errorText("city")}
          </div>
          <div>
            {labelFor("province")}
            <input
              id="province"
              autoComplete="address-level1"
              value={form.province}
              onChange={(event) => update("province", event.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            {labelFor("postal_code")}
            <input
              id="postal_code"
              autoComplete="postal-code"
              value={form.postal_code}
              onChange={(event) => update("postal_code", event.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            {labelFor("country_code")}
            <select
              id="country_code"
              autoComplete="country"
              value={form.country_code}
              onChange={(event) => update("country_code", event.target.value)}
              className={inputClasses}
            >
              {countries.length === 0 ? (
                <option value="">Select a country</option>
              ) : (
                countries.map((country) => (
                  <option key={country.iso_2} value={country.iso_2}>
                    {country.name ?? country.iso_2?.toUpperCase()}
                  </option>
                ))
              )}
            </select>
            {errorText("country_code")}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || countries.length === 0}
        className="mt-6 w-full sm:w-auto"
      >
        {isSubmitting ? "Saving..." : "Continue to delivery"}
      </Button>
    </form>
  );
}