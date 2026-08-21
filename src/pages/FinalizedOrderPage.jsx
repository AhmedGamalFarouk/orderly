import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Container from "../components/Container";
import Button from "../components/Button";
import Table from "../components/Table";
import Avatar from "../components/Avatar";
import {
  ArrowLeftIcon,
  CopyIcon,
  WhatsAppIcon,
  ReceiptIcon,
  SparklesIcon,
} from "../assets/icons/icons";
import { handleToast, handleError } from "../components/alerts";
import CelebrationAnimation from "../components/CelebrationAnimation";
import { api } from "../Firebase/api_util";
import { setFinalizedOrder } from "../features/slices/orderSlice";
import { formatCurrency } from "../utils/formatCurrency";

const FinalizedOrderPage = () => {
  const finalizedOrder = useSelector((state) => state.order.finalizedOrder);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { spaceId } = useParams();
  const [loading, setLoading] = useState(!finalizedOrder);

  // Bill Splitting states
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [tipAmount, setTipAmount] = useState("0");
  const [splitMode, setSplitMode] = useState("proportional"); // proportional or equal
  const [paymentNote, setPaymentNote] = useState("");

  useEffect(() => {
    if ((finalizedOrder && finalizedOrder.spaceId === spaceId) || (!spaceId && finalizedOrder)) {
      setLoading(false);
      if (!finalizedOrder && !spaceId) navigate("/home");
      return;
    }

    let active = true;
    api.space
      .getSpaceById(spaceId)
      .then((space) => {
        if (!active) return;
        if (space?.finalizedOrder) {
          dispatch(setFinalizedOrder({ ...space.finalizedOrder, spaceId }));
        } else {
          navigate("/home");
        }
      })
      .catch(() => {
        if (active) navigate("/home");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dispatch, finalizedOrder, navigate, spaceId]);

  if (loading || !finalizedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center space-y-3">
          <span className="loading loading-spinner text-primary loading-lg"></span>
          <p className="font-body text-sm text-neutral">Loading finalized receipt...</p>
        </div>
      </div>
    );
  }

  const money = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
  const collectiveOrder = (Array.isArray(finalizedOrder.collectiveOrder)
    ? finalizedOrder.collectiveOrder
    : []
  )
    .filter(Boolean)
    .map((item) => ({
      ...item,
      qty: money(item.qty),
      pricePerItem: money(item.pricePerItem),
      subtotal: money(item.subtotal),
    }));

  const participantOrders = (Array.isArray(finalizedOrder.participantOrders)
    ? finalizedOrder.participantOrders
    : []
  )
    .filter(Boolean)
    .map((participant) => ({
      ...participant,
      items: (Array.isArray(participant.items) ? participant.items : [])
        .filter(Boolean)
        .map((item) => ({
          ...item,
          qty: money(item.qty),
          pricePerItem: money(item.pricePerItem),
          subtotal: money(item.subtotal),
        })),
      total: money(participant.total),
    }));

  const subtotalSum = money(finalizedOrder.grandTotal);
  const feeVal = Math.max(0, Number(deliveryFee) || 0);
  const tipVal = Math.max(0, Number(tipAmount) || 0);
  const extraFeesTotal = feeVal + tipVal;
  const grandTotalWithFees = subtotalSum + extraFeesTotal;

  // Calculate adjusted split per participant
  const totalParticipants = Math.max(1, participantOrders.length);
  const splitBreakdown = participantOrders.map((p) => {
    let participantExtra = 0;
    if (splitMode === "equal") {
      participantExtra = extraFeesTotal / totalParticipants;
    } else {
      // Proportional split based on food subtotal
      participantExtra = subtotalSum > 0 ? (p.total / subtotalSum) * extraFeesTotal : 0;
    }
    const finalOwed = p.total + participantExtra;
    return {
      ...p,
      extraShare: participantExtra,
      finalTotal: finalOwed,
    };
  });

  const collectiveTableHeaders = [
    { key: "qty", label: "Qty" },
    { key: "itemName", label: "Item Name" },
    { key: "pricePerItem", label: "Price/Item" },
    { key: "subtotal", label: "Subtotal" },
  ];

  const collectiveTableData = collectiveOrder.map((item) => ({
    qty: `${item.qty}×`,
    itemName: item.itemName,
    pricePerItem: formatCurrency(item.pricePerItem),
    subtotal: formatCurrency(item.subtotal),
  }));

  const handleBackToSpaces = () => {
    navigate("/home");
  };

  const generateShareText = () => {
    return `🍽️ *ORDER FINALIZED: ${finalizedOrder.orderName}*
📍 Venue: ${finalizedOrder.restaurant}
━━━━━━━━━━━━━━━━━━━━
*COLLECTIVE ORDER:*
${collectiveOrder.map((i) => `• ${i.qty}× ${i.itemName} (${formatCurrency(i.subtotal)})`).join("\n")}

💰 *Food Subtotal:* ${formatCurrency(subtotalSum)}${
      extraFeesTotal > 0
        ? `\n🚚 *Delivery & Fees:* ${formatCurrency(feeVal)}\n💖 *Tip:* ${formatCurrency(tipVal)}\n💳 *Total Amount:* ${formatCurrency(grandTotalWithFees)}`
        : ""
    }

━━━━━━━━━━━━━━━━━━━━
*WHO OWES WHAT:*
${splitBreakdown
  .map(
    (p) =>
      `👤 *${p.name}:* ${formatCurrency(p.finalTotal)}${
        extraFeesTotal > 0 ? ` _(Food: ${formatCurrency(p.total)} + Fees: ${formatCurrency(p.extraShare)})_` : ""
      }`
  )
  .join("\n")}
${paymentNote ? `\n💳 *Payment Handle:* ${paymentNote}` : ""}
━━━━━━━━━━━━━━━━━━━━
_Generated with Orderly_`;
  };

  const handleCopyOrder = () => {
    const text = generateShareText();
    if (!navigator.clipboard?.writeText) {
      handleError("Clipboard access unavailable.");
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => handleToast("Consolidated receipt copied to clipboard!"))
      .catch(() => handleError("Failed to copy receipt."));
  };

  return (
    <div className="min-h-screen bg-base-100 py-10 px-4 sm:px-6 lg:px-8 text-base-content">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        {/* Confetti / Celebration */}
        <CelebrationAnimation participants={participantOrders} />

        {/* Hero Finalized Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/15 text-success rounded-full text-xs font-bold mb-3">
            <SparklesIcon className="w-4 h-4" />
            <span>Order Locked & Consolidated</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-base-content tracking-tight">
            Order Finalized!
          </h1>
          <p className="font-body text-base text-neutral mt-2">
            Summary for <span className="font-semibold text-primary font-heading text-lg">'{finalizedOrder.orderName}'</span> from{" "}
            <span className="font-semibold text-primary font-heading text-lg">'{finalizedOrder.restaurant}'</span>.
          </p>
        </div>

        {/* Bill Splitter & Extra Fees Configurator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-base-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-200/60 pb-4">
            <div className="flex items-center gap-2">
              <ReceiptIcon className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-base-content">
                Bill Splitting & Delivery Fees
              </h2>
            </div>
            <span className="text-xs text-neutral">
              Adjust delivery & tips to split evenly or proportionally
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label text-xs font-bold text-base-content uppercase tracking-wider p-1">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                className="input input-bordered w-full rounded-xl bg-base-100"
                placeholder="0.00"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-base-content uppercase tracking-wider p-1">
                Tip / Tax ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                className="input input-bordered w-full rounded-xl bg-base-100"
                placeholder="0.00"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-base-content uppercase tracking-wider p-1">
                Split Extra Fees
              </label>
              <select
                className="select select-bordered w-full rounded-xl bg-base-100 text-xs font-semibold"
                value={splitMode}
                onChange={(e) => setSplitMode(e.target.value)}
              >
                <option value="proportional">Proportional to Food Total</option>
                <option value="equal">Split Evenly per Person</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label text-xs font-bold text-base-content uppercase tracking-wider p-1">
              Payment Handle Note (Optional)
            </label>
            <input
              type="text"
              className="input input-bordered w-full rounded-xl bg-base-100 text-xs"
              placeholder="e.g., Venmo @chef_alex | Instapay / PayPal link"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
            />
          </div>
        </div>

        {/* Collective Order Summary Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-base-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold text-base-content">
              Kitchen / Restaurant Items
            </h2>
            <span className="badge badge-primary font-semibold text-xs">
              {collectiveOrder.reduce((sum, i) => sum + i.qty, 0)} Total Dishes
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-base-200/80">
            <Table headers={collectiveTableHeaders} data={collectiveTableData} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-4 border-t border-base-200">
            <div className="text-xs text-neutral space-y-0.5">
              <p>Food Subtotal: {formatCurrency(subtotalSum)}</p>
              {extraFeesTotal > 0 && (
                <p>
                  Delivery & Tip Added: +{formatCurrency(extraFeesTotal)}
                </p>
              )}
            </div>
            <div className="font-heading text-2xl font-bold text-primary self-end sm:self-auto">
              Total Due: {formatCurrency(grandTotalWithFees)}
            </div>
          </div>
        </div>

        {/* Participant Breakdowns Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-base-200 shadow-xs">
          <h2 className="font-heading text-2xl font-bold text-base-content mb-6">
            Individual Split & Selections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {splitBreakdown.map((participant, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-5 bg-base-200/40 rounded-2xl border border-base-200 hover:border-primary/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        title={participant.initials || participant.name}
                        className="w-10 h-10 text-sm font-bold bg-primary text-primary-content"
                      />
                      <div>
                        <h3 className="font-heading text-base font-bold text-base-content">
                          {participant.name}
                        </h3>
                        <span className="text-[11px] text-neutral font-body">
                          {participant.items.length} {participant.items.length === 1 ? "dish" : "dishes"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-base-200/60">
                    {participant.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex justify-between items-center text-xs font-body text-neutral"
                      >
                        <span>
                          {item.qty}× {item.itemName}
                        </span>
                        <span className="font-semibold text-base-content">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {extraFeesTotal > 0 && (
                    <div className="flex justify-between items-center text-[11px] text-secondary font-medium pt-2 mt-2 border-t border-dashed border-base-300">
                      <span>Delivery / Tip Share:</span>
                      <span>+{formatCurrency(participant.extraShare)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 mt-3 border-t border-base-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral">
                    Amount Owed
                  </span>
                  <span className="font-body text-lg font-extrabold text-primary">
                    {formatCurrency(participant.finalTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons & Multi-Channel Sharing */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            onClick={handleBackToSpaces}
            variant="ghost"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium gap-2 border border-base-200 bg-white hover:bg-base-200"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
          </Button>

          <Button
            onClick={handleCopyOrder}
            variant="primary"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold gap-2 shadow-xs"
          >
            <CopyIcon className="w-4 h-4" /> Copy Receipt Breakdown
          </Button>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generateShareText())}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-md w-full sm:w-auto px-6 rounded-xl font-bold gap-2 text-[#25D366] hover:bg-[#25D366] hover:text-white border-[#25D366]/40"
          >
            <WhatsAppIcon className="w-4 h-4" /> Share on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default FinalizedOrderPage;
