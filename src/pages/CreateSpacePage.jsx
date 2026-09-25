import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

// Components
import { fetchFavouriteMenus } from "../features/slices/menuSlice";
import SpaceDetailsForm from "../components/SpaceDetailsForm";
import Container from "../components/Container";
import MenuSetupTabs from "../components/MenuSetupTabs";
import CreateNewMenuSection from "../components/CreateNewMenuSection";
import FavouriteMenuSection from "../components/FavouriteMenuSection";
import FormActionButtons from "../components/FormActionButtons";
import { SparklesIcon } from "../assets/icons/icons";

// features
import { createNewSpace } from "../features/slices/spaceReducer";
import { setCurrentSpace } from "../features/slices/adminReducer";
import { handleError } from "../components/alerts";
import { DEFAULT_CURRENCY } from "../utils/formatCurrency";

const CreateSpacePage = () => {
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  const [menuOption, setMenuOption] = useState("createNew");
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "", description: "", price: "" },
  ]);
  const [saveAsFavourite, setSaveAsFavourite] = useState(false);
  const [favouriteMenuName, setFavouriteMenuName] = useState("");
  const [selectedFavouriteMenu, setSelectedFavouriteMenu] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
  const favouriteMenus = useSelector((state) => state.menu.favouriteMenus);

  useEffect(() => {
    dispatch(fetchFavouriteMenus(admin.id));
  }, [dispatch, admin.id]);

  const handleAddMenuItem = () => {
    setMenuItems([
      ...menuItems,
      { id: Date.now(), name: "", description: "", price: "" },
    ]);
  };

  const handleRemoveMenuItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const handleMenuItemChange = (id, field, value) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleApplyPreset = (presetItems) => {
    const formatted = presetItems.map((p, idx) => ({
      id: Date.now() + idx,
      name: p.name || "",
      description: p.description || "",
      price: String(p.price || ""),
    }));
    setMenuItems(formatted);
    if (!restaurantName && presetItems[0]?.name) {
      setRestaurantName(spaceName || "Selected Restaurant");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const formData = {
      spaceDetails: {
        spaceName,
        description,
        restaurantName,
        currency,
      },
      menuSetup: {
        menuOption,
        ...(menuOption === "createNew" && {
          menuItems,
          saveAsFavourite,
          ...(saveAsFavourite && { favouriteMenuName }),
        }),
        ...(menuOption === "useFavourite" && {
          selectedFavouriteMenu,
        }),
      },
    };

    const { spaceDetails, menuSetup } = formData;

    if (!spaceName.trim() || !restaurantName.trim()) {
      setFormError("Space name and restaurant name are required.");
      return;
    }
    if (
      menuOption === "createNew" &&
      (!menuItems.length ||
        menuItems.some((item) => {
          const price = Number(item.price);
          return (
            !item.name.trim() ||
            item.price === "" ||
            !Number.isFinite(price) ||
            price < 0
          );
        }))
    ) {
      setFormError("Every menu item needs a valid name and non-negative price.");
      return;
    }
    if (menuOption === "createNew" && saveAsFavourite && !favouriteMenuName.trim()) {
      setFormError("Favourite menu name is required to save.");
      return;
    }
    if (menuOption === "useFavourite" && !selectedFavouriteMenu) {
      setFormError("Please select a favourite menu from your saved list.");
      return;
    }
    const selectedMenu = favouriteMenus.find((item) => item.id === selectedFavouriteMenu);
    if (menuOption === "useFavourite" && !selectedMenu?.items?.length) {
      setFormError("The selected favourite menu has no items.");
      return;
    }
    const itemsCollection = menuOption === "createNew" ? menuItems : selectedMenu.items;
    if (itemsCollection.length > 499) {
      setFormError("A menu cannot contain more than 499 items.");
      return;
    }

    spaceDetails.adminId = admin.id;
    spaceDetails.isFavourite = menuSetup.saveAsFavourite || false;
    spaceDetails.favouriteMenuName = menuSetup.favouriteMenuName || "";

    try {
      setIsSubmitting(true);
      const result = await dispatch(
        createNewSpace({ space: spaceDetails, menuItems: itemsCollection })
      ).unwrap();
      const spaceId = result.id;
      dispatch(setCurrentSpace(spaceId));
      navigate("/space/" + spaceId);
    } catch (error) {
      setFormError(error.message || "Could not create space.");
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className="bg-base-100 min-h-[calc(100vh-4rem)] py-10">
      <Container>
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Host Workspace</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-base-content">
            Create Ordering Space
          </h1>
          <p className="font-body text-sm text-neutral mt-1">
            Set up the venue and food items. You'll get a shareable room link instantly.
          </p>
        </div>

        {formError && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-center">
            <p role="alert" className="text-error text-sm font-medium">
              {formError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Step 1: Space Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-base-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-content text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-heading text-xl font-bold text-base-content">
                Space & Restaurant Details
              </h2>
            </div>
            <SpaceDetailsForm
              spaceName={spaceName}
              setSpaceName={setSpaceName}
              description={description}
              setDescription={setDescription}
              restaurantName={restaurantName}
              setRestaurantName={setRestaurantName}
              currency={currency}
              setCurrency={setCurrency}
            />
          </div>

          {/* Step 2: Menu Setup */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-base-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-content text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-heading text-xl font-bold text-base-content">
                Menu Setup
              </h2>
            </div>

            <MenuSetupTabs menuOption={menuOption} setMenuOption={setMenuOption} />

            <div className="mt-4">
              {menuOption === "createNew" && (
                <CreateNewMenuSection
                  menuItems={menuItems}
                  handleAddMenuItem={handleAddMenuItem}
                  handleRemoveMenuItem={handleRemoveMenuItem}
                  handleMenuItemChange={handleMenuItemChange}
                  saveAsFavourite={saveAsFavourite}
                  setSaveAsFavourite={setSaveAsFavourite}
                  favouriteMenuName={favouriteMenuName}
                  setFavouriteMenuName={setFavouriteMenuName}
                  onApplyPreset={handleApplyPreset}
                  currency={currency}
                />
              )}

              {menuOption === "useFavourite" && (
                <FavouriteMenuSection
                  favouriteMenus={favouriteMenus}
                  selectedFavouriteMenu={selectedFavouriteMenu}
                  setSelectedFavouriteMenu={(menuId) => {
                    setSelectedFavouriteMenu(menuId);
                    // Default to the currency the favourite menu was priced in.
                    const menu = favouriteMenus.find((item) => item.id === menuId);
                    if (menu?.currency) setCurrency(menu.currency);
                  }}
                  currency={currency}
                />
              )}
            </div>
          </div>

          {/* Form Action Buttons */}
          <FormActionButtons onCancel={handleCancel} isSubmitting={isSubmitting} />
        </form>
      </Container>
    </div>
  );
};

export default CreateSpacePage;
