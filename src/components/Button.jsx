
const Button = ({ children, variant = "primary", onClick, type = "button", className = "", disabled = false }) => {
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    info: "btn-info",
    success: "btn-success",
    warning: "btn-warning",
    error: "btn-error",
    neutral: "btn-neutral",
    ghost: "btn-ghost",
    outline: "btn-outline",
  }[variant];

  return (
    <button
      type={type}
      className={`btn ${variantClass} rounded-box px-4 py-2 text-base font-medium ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
