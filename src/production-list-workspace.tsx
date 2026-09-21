import type { HTMLAttributes } from "react";

export function ListWorkspace({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <main className={`ws-list-workspace ${className}`.trim()} data-list-workspace="true" {...props} />;
}
