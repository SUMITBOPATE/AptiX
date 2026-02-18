import ArrowRight from '../../icons/ArrowRight';

const Button = ({
  onClick,
  text = "Start Learning",
  className = "",
  disabled = false,
  variant = "primary" // "primary", "secondary", etc.
}) => {
  // Color variants using theme colors
  const variants = {
    primary: "bg-primary text-white  hover:blur-[0.5px] hover:scale-[0.97]",
    //  hover:bg-primary-soft",
    // secondary: "bg-primary text-white ",
  };

  const baseClasses = "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = variants[variant] || variants.primary;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      <ArrowRight className="w-5 h-5" />
    </button>
  );
};

export default Button;
