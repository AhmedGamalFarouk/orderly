import React from "react";

const FavouriteMenuSection = ({
  favouriteMenus,
  selectedFavouriteMenu,
  setSelectedFavouriteMenu,
}) => {
  return (
    <div className="form-control flex flex-col gap-4">
      <label className="label">
        <span className="label-text font-body text-neutral">Select a Favourite Menu</span>
      </label>
      <select
        className="w-full px-4 py-3 rounded-lg bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        value={selectedFavouriteMenu}
        onChange={(e) => setSelectedFavouriteMenu(e.target.value)}
        required
      >
        <option value="" disabled className="text-neutral">
          Select a menu
        </option>
        {favouriteMenus.map((menu) => (
          <option key={menu.id} value={menu.id} className="text-base-content">
            {menu.name}
          </option>
        ))}
      </select>

      {selectedFavouriteMenu && (
        <div className="bg-base-200 p-4 rounded-lg shadow-sm mt-4">
          <h3 className="font-body text-lg font-semibold text-base-content mb-3">Selected Menu Details:</h3>
          <div className="flex flex-col gap-2">
            {favouriteMenus
              .find((menu) => menu.id === selectedFavouriteMenu)
              ?.items.map((item, index) => (
                <div key={index} className="flex justify-between font-body text-sm text-neutral">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavouriteMenuSection;
