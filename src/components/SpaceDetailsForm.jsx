import React from "react";
import FormInput from "./FormInput";
import { CURRENCIES } from "../utils/formatCurrency";

const SpaceDetailsForm = ({
  spaceName,
  setSpaceName,
  description,
  setDescription,
  restaurantName,
  setRestaurantName,
  currency,
  setCurrency,
}) => {
  return (
    <div className="bg-base-100 shadow-sm p-6 rounded-xl">
      <div className="head">
        <h2 className="font-heading text-2xl text-base-content mb-6">Space Details</h2>
      </div>
      <div className="flex flex-col gap-4">
        <FormInput
          label="Space Name"
          placeholder="e.g., Team Lunch Order"
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
          required
        />
        <FormInput
          label="Description"
          placeholder="e.g., Weekly team lunch for software development department"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isTextArea
        />
        <FormInput
          label="Restaurant Name"
          placeholder="e.g., Pizza Palace"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />
        <div className="form-control flex flex-col gap-2">
          <label htmlFor="space-currency" className="label">
            <span className="label-text font-body text-neutral">Currency</span>
          </label>
          <select
            id="space-currency"
            className="w-full px-4 py-3 rounded-lg bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          >
            {CURRENCIES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetailsForm;
