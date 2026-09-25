import { createContext, useContext } from "react";
import { DEFAULT_CURRENCY, formatCurrency } from "./formatCurrency";

// The current ordering space's currency, provided by SpaceScreen.
export const CurrencyContext = createContext(DEFAULT_CURRENCY);

// Returns a formatter bound to the current space's currency.
export function useFormatMoney() {
  const currency = useContext(CurrencyContext);
  return (value) => formatCurrency(value, currency);
}
