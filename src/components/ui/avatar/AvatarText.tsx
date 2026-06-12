interface AvatarTextProps {
  name: string;
  className?: string;
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
  status?: "online" | "offline" | "busy" | "none";
}

const sizeClasses = {
  xsmall: "h-6 w-6 text-xs",
  small: "h-8 w-8 text-xs",
  medium: "h-10 w-10 text-sm",
  large: "h-12 w-12 text-base",
  xlarge: "h-14 w-14 text-lg",
  xxlarge: "h-16 w-16 text-xl",
};

const statusClasses = {
  online: "bg-success-500",
  offline: "bg-error-400",
  busy: "bg-warning-500",
};

const AvatarText: React.FC<AvatarTextProps> = ({
  name,
  className = "",
  size = "medium",
  status = "none",
}) => {
  // Generate initials from name
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent pastel color based on the name
  const getColorClass = (name: string) => {
    const colors = [
      "bg-brand-100 text-brand-600",
      "bg-pink-100 text-pink-600",
      "bg-cyan-100 text-cyan-600",
      "bg-orange-100 text-orange-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-yellow-100 text-yellow-600",
      "bg-error-100 text-error-600",
    ];

    const index = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className={`relative shrink-0 ${sizeClasses[size]} ${className}`}>
      <div
        className={`flex h-full w-full items-center justify-center rounded-full font-medium ${getColorClass(name)}`}
        aria-label={name}
        title={name}
      >
        {initials}
      </div>
      {status !== "none" && (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900 ${statusClasses[status]}`}
        />
      )}
    </div>
  );
};

export default AvatarText;
