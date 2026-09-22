import { Download, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { downloadExcel, downloadPdf, type ExportColumn, type ExportReport } from "./export-utils";

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

export function Dialog({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={wide ? "dialog-panel dialog-wide" : "dialog-panel"} role="dialog" aria-modal="true" aria-label={title}>
        <div className="dialog-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="dialog-close" aria-label="Close dialog" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
}
