import Button from "../Button";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFinalizedOrder } from "../../features/slices/orderSlice";
import { api } from "../../Firebase/api_util";
import { handleError } from "../alerts";
import { auth } from "../../Firebase/config";
import { ArrowRightIcon } from "../../assets/icons/icons";
import { summarizeOrders } from "../../utils/orderSummary";

export default function OrderSideInfo({ isFinalized = false, spaceAdminId }) {
  const { spaceId } = useParams();
  const { arr } = useSelector((state) => state.single);
  const participants = useSelector((state) => state.participants);
  const adminId = useSelector((state) => state.admin.id);
  // Only the space's owner may finalize; being signed in is not enough.
  const isAdmin = Boolean(
    spaceAdminId &&
      adminId === spaceAdminId &&
      auth.currentUser?.uid === spaceAdminId
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleFinalizeOrder = async () => {
    if (isFinalizing) return;
    setIsFinalizing(true);
    try {
      const [space, menuItems, storedParticipants] = await Promise.all([
        api.space.getSpaceById(spaceId),
        api.space.getMenuItems(spaceId),
        api.space.getParticipants(spaceId),
      ]);
      if (!space) throw new Error("Ordering space not found.");

      const localSelectedItems = arr
        .filter((item) => item.quantity > 0)
        .map(({ id, name, price, quantity }) => ({
          itemId: id,
          name,
          price,
          quantity,
        }));
      const currentParticipantId = sessionStorage.getItem(`participant:${spaceId}`);
      const sourceParticipants = (storedParticipants.length ? storedParticipants : participants).map((participant) => (
        participant.id === currentParticipantId && localSelectedItems.length
          ? { ...participant, selectedItems: localSelectedItems }
          : participant
      ));
      if (
        localSelectedItems.length &&
        !(currentParticipantId && sourceParticipants.some((participant) => participant.id === currentParticipantId))
      ) {
        sourceParticipants.push({
          id: currentParticipantId || "you",
          name: "You",
          selectedItems: localSelectedItems,
        });
      }
      const { participantOrders, collectiveOrder, grandTotal } = summarizeOrders(
        sourceParticipants,
        menuItems
      );

      if (!collectiveOrder.length) {
        throw new Error("Add at least one item before finalizing the order.");
      }

      const finalizedOrder = { spaceId, orderName: space.spaceName || "Order", restaurant: space.restaurantName || "Restaurant", collectiveOrder, grandTotal, participantOrders };
      await api.order.finalizeSpace(spaceId, finalizedOrder);
      dispatch(setFinalizedOrder(finalizedOrder));
      navigate(`/finalized-order/${spaceId}`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 pt-2 border-t border-base-200">
      {isFinalized ? (
        <div className="flex flex-col gap-2">
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl text-center text-xs font-semibold">
            Order has been finalized by the host
          </div>
          {isAdmin && (
            <Button
              variant="primary"
              type="button"
              className="w-full py-2.5 text-xs font-bold"
              onClick={() => navigate(`/finalized-order/${spaceId}`)}
            >
              View Receipt
            </Button>
          )}
          <Button
            variant="outline"
            type="button"
            className="w-full py-2.5 text-xs font-medium"
            onClick={() => navigate(isAdmin ? "/home" : "/")}
          >
            Return Home
          </Button>
        </div>
      ) : (
        <>
          {isAdmin && (
            <Button
              variant="primary"
              type="button"
              className="w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-sm rounded-xl"
              onClick={handleFinalizeOrder}
              disabled={isFinalizing}
            >
              {isFinalizing ? "Finalizing Order..." : "Finalize & Lock Order"}
              {!isFinalizing && <ArrowRightIcon className="w-4 h-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            type="button"
            className="w-full py-2 text-xs font-medium text-neutral hover:text-error"
            onClick={() => navigate(isAdmin ? "/home" : "/")}
          >
            {isAdmin ? "Exit to Dashboard" : "Leave Ordering Room"}
          </Button>
        </>
      )}
    </div>
  );
}

