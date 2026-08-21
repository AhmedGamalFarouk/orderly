import React, { useState } from "react";
import FormInput from "./FormInput";
import Button from "./Button";
import { SparklesIcon, FoodCategoryIcon } from "../assets/icons/icons";

const MENU_PRESETS = [
  {
    title: "Coffee & Bakery",
    icon: "coffee",
    items: [
      { name: "Caffe Latte", description: "Espresso with steamed silky milk", price: "5.00" },
      { name: "Iced Americano", description: "Double shot espresso over chilled water and ice", price: "4.50" },
      { name: "Butter Croissant", description: "Flaky traditional French butter pastry", price: "3.75" },
      { name: "Matcha Latte", description: "Ceremonial grade green tea with oat milk", price: "5.50" },
    ],
  },
  {
    title: "Pizza & Sides",
    icon: "pizza",
    items: [
      { name: "Margherita Pizza", description: "San Marzano tomatoes, fresh mozzarella, basil", price: "16.00" },
      { name: "Pepperoni Passion", description: "Loaded pepperoni with spiced tomato sauce", price: "18.50" },
      { name: "Garlic Knots (6pcs)", description: "Baked dough knots tossed in garlic herb butter", price: "7.00" },
      { name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons, creamy dressing", price: "9.50" },
    ],
  },
  {
    title: "Burger Bar",
    icon: "burger",
    items: [
      { name: "Classic Cheeseburger", description: "Angus patty, cheddar, lettuce, tomato, house sauce", price: "12.50" },
      { name: "Smash Truffle Burger", description: "Double crispy smash patty, swiss, truffle aioli", price: "14.50" },
      { name: "Crispy French Fries", description: "Golden seasoned sea salt fries", price: "4.50" },
      { name: "Vanilla Bean Shake", description: "Hand-spun rich vanilla ice cream shake", price: "6.00" },
    ],
  },
];

const CreateNewMenuSection = ({
  menuItems,
  handleAddMenuItem,
  handleRemoveMenuItem,
  handleMenuItemChange,
  saveAsFavourite,
  setSaveAsFavourite,
  favouriteMenuName,
  setFavouriteMenuName,
  onApplyPreset,
}) => {
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const handleParseBulk = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    const parsed = lines.map((line, idx) => {
      // Regex matches "Item Name - $12.50" or "Item Name, 12.50"
      const match = line.match(/^(.*?)(?:[-—,:]|\s+[$€£])\s*[$€£]?\s*(\d+(?:\.\d+)?)\s*$/);
      if (match) {
        return {
          id: Date.now() + idx,
          name: match[1].trim(),
          description: "",
          price: match[2].trim(),
        };
      }
      return {
        id: Date.now() + idx,
        name: line,
        description: "",
        price: "",
      };
    });

    if (parsed.length > 0 && onApplyPreset) {
      onApplyPreset(parsed);
      setBulkText("");
      setShowBulkPaste(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets Bar */}
      <div className="p-4 bg-base-200/50 rounded-2xl border border-base-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-base-content">
              Quick Menu Templates
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowBulkPaste((prev) => !prev)}
            className="text-xs text-primary font-semibold hover:underline"
          >
            {showBulkPaste ? "Hide Quick Paste" : "Paste text menu"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {MENU_PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => onApplyPreset && onApplyPreset(preset.items)}
              className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-base-200/80 hover:border-primary hover:bg-primary/5 transition-all text-left shadow-2xs"
            >
              <FoodCategoryIcon type={preset.icon} className="w-6 h-6 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-base-content truncate">{preset.title}</p>
                <p className="text-[10px] text-neutral">{preset.items.length} items</p>
              </div>
            </button>
          ))}
        </div>

        {/* Bulk Text Area */}
        {showBulkPaste && (
          <div className="mt-4 pt-3 border-t border-base-200">
            <p className="text-xs text-neutral mb-2">
              Paste lines formatted as <code>Item Name - $Price</code>:
            </p>
            <textarea
              className="textarea textarea-bordered w-full text-xs font-mono rounded-xl bg-white"
              rows={3}
              placeholder="Cheeseburger - $12&#10;Crispy Fries - $4&#10;Iced Tea - $3"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <button
              type="button"
              onClick={handleParseBulk}
              className="btn btn-primary btn-xs mt-2 rounded-lg"
              disabled={!bulkText.trim()}
            >
              Load Pasted Items
            </button>
          </div>
        )}
      </div>

      {/* Menu Item Cards */}
      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-end gap-3 p-4 bg-base-200/40 rounded-2xl border border-base-200/80 hover:border-base-300 transition-colors"
          >
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-12 gap-3 w-full">
              <div className="sm:col-span-4">
                <FormInput
                  label={`Item #${index + 1} Name`}
                  placeholder="e.g., Margherita Pizza"
                  value={item.name}
                  onChange={(e) => handleMenuItemChange(item.id, "name", e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-5">
                <FormInput
                  label="Description (optional)"
                  placeholder="e.g., Fresh basil, olive oil"
                  value={item.description}
                  onChange={(e) => handleMenuItemChange(item.id, "description", e.target.value)}
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput
                  label="Price ($)"
                  type="number"
                  placeholder="12.00"
                  value={item.price}
                  onChange={(e) => handleMenuItemChange(item.id, "price", e.target.value)}
                  required
                />
              </div>
            </div>

            {menuItems.length > 1 && (
              <button
                type="button"
                aria-label={`Delete item ${index + 1}`}
                onClick={() => handleRemoveMenuItem(item.id)}
                className="btn btn-ghost btn-sm btn-square text-neutral hover:text-error hover:bg-error/10 shrink-0 self-end sm:self-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2">
        <Button
          type="button"
          onClick={handleAddMenuItem}
          variant="outline"
          className="btn-sm rounded-xl text-xs font-semibold"
        >
          + Add Another Item
        </Button>
      </div>

      {/* Save as Favourite Box */}
      <div className="p-4 rounded-2xl bg-base-200/30 border border-base-200/80 space-y-3">
        <label className="label cursor-pointer justify-start gap-3 p-0">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            checked={saveAsFavourite}
            onChange={(e) => setSaveAsFavourite(e.target.checked)}
          />
          <span className="label-text font-body text-xs font-semibold text-base-content">
            Save this menu template to my favourites for future spaces
          </span>
        </label>

        {saveAsFavourite && (
          <div className="pt-2 animate-fade-in-up">
            <FormInput
              label="Saved Menu Template Name"
              placeholder="e.g., Friday Pizza Special"
              value={favouriteMenuName}
              onChange={(e) => setFavouriteMenuName(e.target.value)}
              required
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNewMenuSection;

