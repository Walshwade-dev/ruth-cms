import { ReactNode } from "react";

interface OrganicMaskProps {
  children: ReactNode;
  className?: string;
  variant?: "blob-1" | "blob-2" | "blob-3";
}

export function OrganicMask({ children, className = "", variant = "blob-1" }: OrganicMaskProps) {
  // We use asymmetrical border-radius values to create fluid, organic shapes 
  // without needing complex SVG clip-paths that can be hard to scale.
  const shapeClasses = {
    "blob-1": "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
    "blob-2": "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]",
    "blob-3": "rounded-[50%_50%_20%_80%/25%_80%_20%_75%]",
  };

  return (
    <div className={`overflow-hidden transform transition-transform duration-700 hover:scale-[1.03] ${shapeClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
