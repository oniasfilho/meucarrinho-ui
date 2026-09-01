import type { ComponentPropsWithoutRef } from "react";

import styles from "./Button.module.css";

type ButtonProps = ComponentPropsWithoutRef<"button">;

export function Button({ type = "button", className, ...props }: ButtonProps) {
  const buttonClassName = className
    ? `${styles.button} ${className}`
    : styles.button;

  return <button type={type} className={buttonClassName} {...props} />;
}
