export default function Avatar({ title = "G" }) {
  const initialChar = String(title || "G").trim()[0]?.toUpperCase() || "G";
  return (
    <div className="size-10 bg-primary/20 text-primary font-semibold text-lg text-center leading-10 rounded-full flex items-center justify-center">
      {initialChar}
    </div>
  );
}
