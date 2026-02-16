import ArrowRight from '../../icons/ArrowRight';

const Button = ({
  onClick,
  text = "Start Learning",
  className = "",
  disabled = false,
  variant = "green" // "default", "green", "blue", etc.
}) => {
  // Color variants
  const variants = {
    default: "bg-green-500 text-white hover:bg-green-600",
    green: "bg-lime-500 text-white hover:bg-lime-600",
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    purple: "bg-purple-500 text-white hover:bg-purple-600",
  };

  const baseClasses = "w-full flex items-center justify-center py-2 rounded-lg font-bold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = variants[variant] || variants.default;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      <ArrowRight className="size-5 ml-2" />
    </button>
  );
};

export default Button;
