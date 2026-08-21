import "./Spinner.css";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="ripple-spinner">
        <div className="ripple-dot"></div>
        <div className="ripple-circle"></div>
        <div className="ripple-circle"></div>
        <div className="ripple-circle"></div>
      </div>
    </div>
  );
}
