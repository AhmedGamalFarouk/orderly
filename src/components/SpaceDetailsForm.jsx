import React from "react";
import FormInput from "./FormInput";

const SpaceDetailsForm = ({
  spaceName,
  setSpaceName,
  description,
  setDescription,
  restaurantName,
  setRestaurantName,
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
      </div>
    </div>
  );
};

export default SpaceDetailsForm;
