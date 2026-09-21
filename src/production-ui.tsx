import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export function PageHeader({ children, ...props }: HTMLAttributes<HTMLElement>) {
  return <header className="ws-page-header" {...props}>{children}</header>;
}

export function Surface({ children, className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`ws-surface ${className}`.trim()} {...props}>{children}</section>;
}

export type ButtonVariant = "primary" | "secondary" | "quiet" | "destructive";
export function Button({ variant = "secondary", compact = false, busy = false, children, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; compact?: boolean; busy?: boolean }) {
  return <button className="ws-button" data-variant={variant} data-compact={compact || undefined} aria-busy={busy || undefined} disabled={disabled || busy} {...props}>{busy ? <><span className="ws-spinner" aria-hidden="true"/>Working…</> : children}</button>;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warning" | "danger" | "info"; children: ReactNode }) {
  return <span className="ws-badge" data-tone={tone}>{children}</span>;
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="ws-empty-state"><strong>{title}</strong>{children && <p>{children}</p>}</div>;
}
