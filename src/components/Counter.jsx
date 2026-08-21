import { createContext, useContext } from "react";
import { MinusIcon, PlusIcon } from "../assets/icons";
import { setQuantity } from "../features/slices/singlemenu";
import { useDispatch, useSelector } from "react-redux";

const CounterContext = createContext();

function Counter({ children, ind, disabled = false }) {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.single.arr[ind]?.quantity ?? 0);
  const increment = () => {
    dispatch(setQuantity({ ind: ind, quantity: count + 1 }));
  };
  const decrement = () => {
    if (count === 0) return;
    dispatch(setQuantity({ ind: ind, quantity: count - 1 }));
  };

  return (
    <CounterContext.Provider value={{ increment, decrement, count, disabled }}>
      <div className="flex items-center select-none w-fit rounded-full bg-base-200/80 p-0.5 border border-base-300/60 shadow-xs">
        {children}
      </div>
    </CounterContext.Provider>
  );
}

function Increment() {
  const { increment, disabled } = useContext(CounterContext);
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label="Add one item"
      onClick={() => increment()}
      className="bg-primary text-primary-content size-9 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-90 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <PlusIcon className="w-4 h-4 stroke-[2.5]" />
    </button>
  );
}

function Decrement() {
  const { decrement, count, disabled } = useContext(CounterContext);

  return (
    <button
      type="button"
      disabled={disabled || count === 0}
      aria-label="Remove one item"
      onClick={() => decrement()}
      className="bg-base-100 text-base-content size-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-base-200 active:scale-90 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed border border-base-300/40"
    >
      <MinusIcon className="w-4 h-4 stroke-[2.5]" />
    </button>
  );
}

function Count() {
  const { count } = useContext(CounterContext);
  return (
    <div className="text-base-content font-body text-base font-semibold text-center w-8 flex items-center justify-center">
      {count}
    </div>
  );
}

Counter.Increment = Increment;
Counter.Decrement = Decrement;
Counter.Count = Count;

export default Counter;
