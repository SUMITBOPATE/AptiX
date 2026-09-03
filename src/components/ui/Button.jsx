import ArrowRight from '../../icons/ArrowRight';

const Button = ({
  onClick,
  text = "Start Learning",
  className = "",
  disabled = false,
  variant = "primary"
}) => {
  const variants = {
    primary: "bg-lime-400 text-white font-bold rounded-xl shadow-lg shadow-lime-500/30 hover:scale-[1.02] active:scale-95 transition-all",
  };

  const baseClasses = "w-full flex items-center justify-center gap-2 py-4 px-8 font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
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
