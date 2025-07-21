import React from "react";

interface WarningBannerProps {
  message: string;
  className?: string;
}

export default function WarningBanner({
  message,
  className = "",
}: WarningBannerProps) {
  if (!message) return null;
  return (
    <div
      className={`bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded mb-4 ${className}`}
      role="alert"
    >
      {message}
    </div>
  );
}
