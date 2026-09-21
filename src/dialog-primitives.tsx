import { type FormEvent, type ReactNode, type RefObject, useEffect, useId, useRef, useState } from "react";

import "./dialog-primitives.css";

type ModalDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onRequestClose: () => void;
  size?: "default" | "wide";
};

function focusableElements(dialog: HTMLDialogElement): HTMLElement[] {
  return Array.from(dialog.querySelectorAll<HTMLElement>(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
  )).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
}

export function ModalDialog({ open, title, children, initialFocusRef, onRequestClose, size = "default" }: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      queueMicrotask(() => (initialFocusRef?.current ?? focusableElements(dialog)[0] ?? dialog).focus());
    } else if (!open && dialog.open) {
      dialog.close();
      returnFocusRef.current?.focus();
    }
  }, [initialFocusRef, open]);

  useEffect(() => () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    returnFocusRef.current?.focus();
  }, []);

  function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = focusableElements(dialog);
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return <dialog
    ref={dialogRef}
    className={`ws-dialog${size === "wide" ? " ws-dialog-wide" : ""}`}
    aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onRequestClose(); }}
    onKeyDown={trapFocus}
  >
    <h2 id={titleId}>{title}</h2>
    {children}
  </dialog>;
}

type DirtyFormDialogProps = {
  open: boolean;
  title: string;
  dirty: boolean;
  errors: string[];
  busy?: boolean;
  initialFocusRef: RefObject<HTMLElement | null>;
  submitLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  children: ReactNode;
  size?: "default" | "wide";
};

export function DirtyFormDialog({ open, title, dirty, errors, busy = false, initialFocusRef, submitLabel, onSubmit, onClose, children, size = "default" }: DirtyFormDialogProps) {
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const keepEditingRef = useRef<HTMLButtonElement>(null);
  const validationId = useId();
  const validationRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!open) setConfirmDiscard(false); }, [open]);
  useEffect(() => { if (errors.length) validationRef.current?.focus(); }, [errors]);

  function requestClose() {
    if (dirty) setConfirmDiscard(true);
    else onClose();
  }

  return <ModalDialog
    open={open}
    title={confirmDiscard ? "Discard unsaved changes?" : title}
    initialFocusRef={confirmDiscard ? keepEditingRef : initialFocusRef}
    onRequestClose={() => confirmDiscard ? setConfirmDiscard(false) : requestClose()}
    size={size}
  >
    {confirmDiscard ? <div role="alertdialog" aria-label="Discard unsaved changes">
      <p>Your unsaved changes will be lost.</p>
      <div className="ws-dialog-actions">
        <button ref={keepEditingRef} type="button" onClick={() => setConfirmDiscard(false)}>Keep editing</button>
        <button type="button" className="ws-danger" onClick={onClose}>Discard changes</button>
      </div>
    </div> : <form noValidate onSubmit={onSubmit} aria-describedby={errors.length ? validationId : undefined}>
      {errors.length > 0 && <div id={validationId} ref={validationRef} className="ws-validation-summary" role="alert" tabIndex={-1}>
        <strong>Fix the following:</strong>
        <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
      </div>}
      <div className="ws-dialog-fields">{children}</div>
      <div className="ws-dialog-actions">
        <button type="submit" disabled={busy}>{submitLabel}</button>
        <button type="button" onClick={requestClose} disabled={busy}>Cancel</button>
      </div>
    </form>}
  </ModalDialog>;
}

type ReasonCommandDialogProps = {
  open: boolean;
  title: string;
  commandLabel: string;
  busy?: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
};

export function ReasonCommandDialog({ open, title, commandLabel, busy = false, onConfirm, onClose }: ReasonCommandDialogProps) {
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const reasonId = useId();

  useEffect(() => {
    if (open) {
      setReason("");
      setErrors([]);
    }
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason.trim()) {
      setErrors(["Enter a reason."]);
      return;
    }
    onConfirm(reason.trim());
  }

  return <DirtyFormDialog
    open={open}
    title={title}
    dirty={Boolean(reason)}
    errors={errors}
    busy={busy}
    initialFocusRef={reasonRef}
    submitLabel={commandLabel}
    onSubmit={submit}
    onClose={onClose}
  >
    <label htmlFor={reasonId}>Reason</label>
    <textarea id={reasonId} ref={reasonRef} value={reason} onChange={(event) => setReason(event.target.value)} required />
  </DirtyFormDialog>;
}
