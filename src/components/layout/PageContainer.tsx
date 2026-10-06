import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Horizontal layout container. Defaults to a <div> so it can be nested safely
 * inside page-level <main> landmarks without creating duplicate landmarks.
 */
export function PageContainer({
  children,
  className = "",
  as: Component = "div"
}: PageContainerProps) {
  return (
    <Component className={`w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </Component>
  );
}
