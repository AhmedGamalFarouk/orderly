import { useEffect, useState } from "react";
import Container from "../components/Container";
import MySelection from "../components/spaceScreenInfo/MySelection";
import CollectiveOrder from "../components/spaceScreenInfo/CollectiveOrder";
import Participants from "../components/spaceScreenInfo/Participants";
import OrderSideInfo from "../components/spaceScreenInfo/OrderSideInfo";
import OrderItem from "../components/OrderItem";
import { useParams } from "react-router";
import { api } from "../Firebase/api_util.js";
import { CurrencyContext } from "../utils/currencyContext";
import { DEFAULT_CURRENCY } from "../utils/formatCurrency";
import { resetMenu, setMenu, setQuantity } from "../features/slices/singlemenu.js";
import { useDispatch, useSelector } from "react-redux";
import UsernamePopup from "../components/userNamePopup.jsx";
import {
  addNewParticipant,
  listenToParticipants,
  saveParticipantOrder,
} from "../features/slices/participantsReducer.js";
import { setCurrentSpace } from "../features/slices/adminReducer.js";
import { handleError, handleToast } from "../components/alerts";
import {
  CopyIcon,
  QrCodeIcon,
  ShareIcon,
  WhatsAppIcon,
} from "../assets/icons/icons";

export default function SpaceScreen() {
  const { arr } = useSelector((state) => state.single);
  const dispatch = useDispatch();
  const { spaceId } = useParams();
  const spaceLink = window.location.origin + "/space/" + spaceId;

  const [spaceInfo, setSpaceInfo] = useState(null);
  const [menu, setremoteMenu] = useState([]);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [spaceFinalized, setSpaceFinalized] = useState(false);
  const [selectionHydrated, setSelectionHydrated] = useState(false);
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const participants = useSelector((state) => state.participants);
  const [participantId, setParticipantId] = useState(() =>
    sessionStorage.getItem(`participant:${spaceId}`)
  );

  useEffect(() => {
    setParticipantId(sessionStorage.getItem(`participant:${spaceId}`));
    setSelectionHydrated(false);
  }, [spaceId]);

  useEffect(() => {
    if (spaceId) {
      const unsubscribe = dispatch(listenToParticipants(spaceId));
      return () => unsubscribe();
    }
  }, [dispatch, spaceId]);

  useEffect(() => {
    if (spaceFinalized) {
      setShowUsernamePopup(false);
      return;
    }
    if (!participantId && menuLoaded && !loadError && !spaceFinalized) {
      setShowUsernamePopup(true);
    }
  }, [loadError, menuLoaded, participantId, spaceFinalized]);

  useEffect(() => {
    if (!participantId || !spaceId || !menuLoaded) return;

    let active = true;
    api.space
      .getParticipants(spaceId)
      .then((storedParticipants) => {
        if (!active || storedParticipants.some((item) => item.id === participantId)) return;

        sessionStorage.removeItem(`participant:${spaceId}`);
        setParticipantId(null);
        setSelectionHydrated(false);
        dispatch(resetMenu());
        menu.forEach((item) =>
          dispatch(
            setMenu({
              id: item.id,
              legacyId: item.legacyId,
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.imageUrl,
            })
          )
        );
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [dispatch, menu, menuLoaded, participantId, spaceId]);

  const handleGuestSubmit = async (name) => {
    try {
      const existing = participants.find((p) => p.name?.trim() === name.trim());
      const id =
        existing?.id ||
        (await dispatch(addNewParticipant({ name: name.trim(), spaceId })).unwrap()).id;

      setParticipantId(id);
      sessionStorage.setItem(`participant:${spaceId}`, id);
      setShowUsernamePopup(false);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    setMenuLoaded(false);
    setSelectionHydrated(false);
    setLoadError("");
    setSpaceFinalized(false);
    dispatch(resetMenu());

    Promise.all([api.space.getSpaceById(spaceId), api.space.getMenuItems(spaceId)])
      .then(([space, res]) => {
        if (!space) throw new Error("This ordering space does not exist.");
        if (!res.length) throw new Error("This ordering space has no menu items.");
        setSpaceInfo(space);
        setremoteMenu(res);
        setSpaceFinalized(space.status === "finalized" || Boolean(space.finalizedOrder));
        setMenuLoaded(true);
        dispatch(setCurrentSpace(spaceId));
      })
      .catch((error) => {
        setLoadError(error.message || "Failed to load ordering space.");
        handleError(error);
      });
  }, [spaceId, dispatch]);

  useEffect(() => {
    if (!menuLoaded) return;
    dispatch(resetMenu());
    menu.forEach((m) => {
      dispatch(
        setMenu({
          id: m.id,
          legacyId: m.legacyId,
          name: m.name,
          description: m.description,
          price: m.price,
          imageUrl: m.imageUrl,
        })
      );
    });
  }, [dispatch, menu, menuLoaded]);

  useEffect(() => {
    if (
      spaceFinalized ||
      !participantId ||
      !spaceId ||
      !menuLoaded ||
      !selectionHydrated ||
      !menu.length ||
      !arr.length
    )
      return;

    const selectedItems = arr
      .filter((item) => item.quantity > 0)
      .map(({ id, name, price, quantity }) => ({ itemId: id, name, price, quantity }));
    dispatch(saveParticipantOrder({ spaceId, participantId, selectedItems }))
      .unwrap()
      .catch(handleError);
  }, [arr, dispatch, menu, menuLoaded, participantId, selectionHydrated, spaceFinalized, spaceId]);

  // Keep the room in sync with the host: once the space is finalized, lock
  // the counters for every guest instead of letting their writes fail.
  useEffect(() => {
    if (!spaceId || !menuLoaded) return;
    return api.space.watchSpace(
      spaceId,
      (space) => {
        if (!space) return;
        setSpaceInfo(space);
        setSpaceFinalized(space.status === "finalized" || Boolean(space.finalizedOrder));
      },
      (error) => console.error("Failed to listen to space:", error)
    );
  }, [menuLoaded, spaceId]);

  const handleCopyLink = async () => {
    if (!navigator.clipboard?.writeText) {
      handleError("Clipboard access is unavailable in this browser.");
      return;
    }
    try {
      await navigator.clipboard.writeText(spaceLink);
      handleToast("Room link copied to clipboard!");
    } catch {
      handleError("Could not copy the room link.");
    }
  };

  useEffect(() => {
    if (!participantId || !menuLoaded || !arr.length || selectionHydrated) return;
    const participant = participants.find((item) => item.id === participantId);
    if (!participant) return;
    if (participant?.selectedItems?.length) {
      participant.selectedItems.forEach((selected) => {
        const index = arr.findIndex(
          (item) =>
            String(item.id) === String(selected.itemId) ||
            String(item.legacyId) === String(selected.itemId)
        );
        if (index >= 0 && arr[index].quantity !== Number(selected.quantity)) {
          dispatch(setQuantity({ id: arr[index].id, quantity: Number(selected.quantity) }));
        }
      });
    }
    setSelectionHydrated(true);
  }, [arr, dispatch, menuLoaded, participantId, participants, selectionHydrated]);

  const categories = ["All", "Mains", "Drinks", "Desserts", "Sides"];
  const filteredMenu = arr.filter((item) => {
    if (activeCategory === "All") return true;
    const text = `${item.name} ${item.description || ""}`.toLowerCase();
    if (activeCategory === "Drinks") {
      return text.includes("coffee") || text.includes("tea") || text.includes("drink") || text.includes("juice") || text.includes("latte") || text.includes("water");
    }
    if (activeCategory === "Desserts") {
      return text.includes("dessert") || text.includes("cake") || text.includes("sweet") || text.includes("cookie") || text.includes("pie");
    }
    if (activeCategory === "Sides") {
      return text.includes("fries") || text.includes("salad") || text.includes("soup") || text.includes("side") || text.includes("chips");
    }
    if (activeCategory === "Mains") {
      return !text.includes("coffee") && !text.includes("tea") && !text.includes("cake") && !text.includes("dessert") && !text.includes("juice");
    }
    return true;
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    spaceLink
  )}`;

  return (
    <CurrencyContext.Provider value={spaceInfo?.currency || DEFAULT_CURRENCY}>
    <Container>
      <UsernamePopup
        isOpen={showUsernamePopup}
        onClose={() => setShowUsernamePopup(false)}
        onSubmit={handleGuestSubmit}
        allowClose={false}
      />

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
          <div className="card w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 relative border border-base-200 text-center">
            <button
              type="button"
              aria-label="Close share dialog"
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
              onClick={() => setShowShareModal(false)}
            >
              ✕
            </button>
            <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-3">
              <QrCodeIcon className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-base-content">
              Invite Friends
            </h3>
            <p className="font-body text-xs text-neutral mt-1 mb-4">
              Scan with mobile camera or share link with your group.
            </p>

            <div className="bg-base-200/50 p-4 rounded-xl flex justify-center mb-4 border border-base-200">
              <img
                src={qrCodeUrl}
                alt="Room QR Code"
                className="w-44 h-44 rounded-lg bg-white p-2 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-primary btn-sm w-full gap-2 rounded-xl"
              >
                <CopyIcon className="w-4 h-4" /> Copy Room Link
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Join our group food order on Orderly! Link: ${spaceLink}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm w-full gap-2 rounded-xl text-[#25D366] hover:bg-[#25D366] hover:text-white"
              >
                <WhatsAppIcon className="w-4 h-4" /> Share via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {loadError && (
        <div className="my-12 p-8 text-center bg-white rounded-2xl border border-error/20 shadow-sm max-w-md mx-auto">
          <p role="alert" className="text-error font-medium mb-4">
            {loadError}
          </p>
        </div>
      )}

      {!loadError && (
        <div className="py-8">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-base-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-primary badge-sm font-semibold">Live Room</span>
                <span className="text-xs font-mono text-neutral bg-base-200 px-2 py-0.5 rounded-md">
                  #{spaceId}
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-base-content">
                {spaceInfo?.restaurantName || "Restaurant Menu"}
              </h1>
              <p className="font-body text-sm text-neutral mt-0.5">
                {spaceInfo?.spaceName ? `${spaceInfo.spaceName} — ` : ""}
                {spaceInfo?.description || "Select dishes to add to your order."}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="btn btn-outline btn-sm rounded-xl gap-2 font-medium"
              >
                <QrCodeIcon className="w-4 h-4 text-primary" /> Invite / QR
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-primary btn-sm rounded-xl gap-2 font-medium"
              >
                <ShareIcon className="w-4 h-4" /> Copy Link
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
            <main className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                      activeCategory === cat
                        ? "bg-primary text-primary-content shadow-xs"
                        : "bg-white text-base-content hover:bg-base-200 border border-base-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredMenu.length > 0 ? (
                  <OrderItem menu={filteredMenu} disabled={spaceFinalized} />
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-base-200">
                    <p className="text-sm text-neutral">
                      No items found in this category.
                    </p>
                  </div>
                )}
              </div>
            </main>

            <aside className="lg:col-span-2 lg:sticky lg:top-24 space-y-5">
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-base-200">
                <Participants />
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-base-200">
                <MySelection />
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-base-200">
                <CollectiveOrder />
                <div className="mt-4">
                  <OrderSideInfo isFinalized={spaceFinalized} spaceAdminId={spaceInfo?.adminId} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </Container>
    </CurrencyContext.Provider>
  );
}
