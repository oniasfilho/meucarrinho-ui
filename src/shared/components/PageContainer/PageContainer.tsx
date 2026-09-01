import type { ReactNode } from "react";

import styles from "./PageContainer.module.css";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  const containerClassName = className
    ? `${styles.container} ${className}`
    : styles.container;

  return <div className={containerClassName}>{children}</div>;
}
