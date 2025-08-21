export default function LoadingSpinner({
  size = "md",
  color = "primary",
}: {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white";
}) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorClasses = {
    primary: "border-[#2ae5b9] border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div className="flex items-center justify-center">
      <output
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </output>
    </div>
  );
}
