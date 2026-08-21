export default function Container({ children, className = "", ...props }) {
  return (
    <div className={`container mx-auto mt-6 px-3 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
