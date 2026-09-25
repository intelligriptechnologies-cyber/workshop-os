import { Download, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { downloadExcel, downloadPdf, type ExportColumn, type ExportReport } from "./export-utils";
import { PAGE_SIZE_OPTIONS } from "./list-utils";

export function ListSearchActions({ onClear, onSearch }: { onClear: () => void; onSearch: () => void }) {
  return (
    <div className="list-search-actions" role="group" aria-label="Search actions">
      <button type="button" className="compact-action" onClick={onClear}>Clear</button>
      <button type="button" className="primary-action compact-action search-action" onClick={onSearch}>Search</button>
    </div>
  );
}

export function PageSizeSelect({ value, onChange, ariaLabel = "Records per page" }: { value: number; onChange: (value: number) => void; ariaLabel?: string }) {
  return (
    <label className="page-size">Per page<select aria-label={ariaLabel} value={value} onChange={(event) => onChange(Number(event.target.value))}>
      {PAGE_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
    </select></label>
  );
}

export function DownloadMenu<T>({ report }: { report: ExportReport<T> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const disabled = report.rows.length === 0;

  useEffect(() => {
    if (!open) return;
    const onClickAway = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const run = (action: (report: ExportReport<T>) => void) => {
    action(report);
    setOpen(false);
  };

  return (
    <div className="download-menu" ref={ref}>
      <button
        type="button"
        className="download-menu-trigger"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Download size={16} /> Download
      </button>
      {open && (
        <div className="download-menu-list" role="menu">
          <button type="button" role="menuitem" onClick={() => run(downloadExcel)}>Excel (.xlsx)</button>
          <button type="button" role="menuitem" onClick={() => run(downloadPdf)}>PDF</button>
        </div>
      )}
    </div>
  );
}

export type { ExportColumn, ExportReport };

export function handleTabListKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
  if (!tabs.length) return;
  const current = Math.max(0, tabs.indexOf(event.target as HTMLButtonElement));
  const next = event.key === "Home" ? 0
    : event.key === "End" ? tabs.length - 1
      : event.key === "ArrowRight" || event.key === "ArrowDown" ? (current + 1) % tabs.length
        : (current - 1 + tabs.length) % tabs.length;
  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}

const dialogStack: symbol[] = [];
let bodyScrollLocks = 0;
let savedBodyOverflow = "";

export function Dialog({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  footer?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const stackId = Symbol("dialog");
    dialogStack.push(stackId);
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const focusable = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
    const onEscape = (event: KeyboardEvent) => {
      if (dialogStack.at(-1) !== stackId) return;
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "Tab") {
        const items = focusable();
        if (!items.length) { event.preventDefault(); panelRef.current?.focus(); return; }
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onEscape);
    if (bodyScrollLocks === 0) savedBodyOverflow = document.body.style.overflow;
    bodyScrollLocks += 1;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => (panelRef.current?.querySelector<HTMLElement>("[data-dialog-initial-focus]") ?? focusable()[0] ?? panelRef.current)?.focus());
    return () => {
      document.removeEventListener("keydown", onEscape);
      const stackIndex = dialogStack.indexOf(stackId);
      if (stackIndex >= 0) dialogStack.splice(stackIndex, 1);
      bodyScrollLocks = Math.max(0, bodyScrollLocks - 1);
      if (bodyScrollLocks === 0) document.body.style.overflow = savedBodyOverflow;
      returnFocusRef.current?.focus();
    };
  }, []);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={panelRef} tabIndex={-1} className={wide ? "dialog-panel dialog-wide" : "dialog-panel"} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="dialog-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="dialog-close" aria-label="Close dialog" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="dialog-body">{children}</div>
        {footer && <div className="dialog-footer">{footer}</div>}
      </div>
    </div>
  );
}
