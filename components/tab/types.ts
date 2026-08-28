import { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode | number | string;
  disabled?: boolean;
}

export type TabVariant = "underline" | "pills" | "bordered";

export interface ReusableTabProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  variant?: TabVariant;
  fullWidth?: boolean;
  headerRight?: ReactNode;
  children?: ReactNode;
}

