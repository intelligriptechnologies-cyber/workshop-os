import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { pageNumbers } from "./list-utils";
import { PageSizeSelect } from "./ui-kit";

type PaginationToolbarProps = {
  from: number;
  to: number;
  totalCount: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeAriaLabel?: string;
  controls?: ReactNode;
};

export function PaginationToolbar({ from, to, totalCount, page, pageCount, onPageChange, pageSize, onPageSizeChange, pageSizeAriaLabel, controls }: PaginationToolbarProps) {
  return <div className="pagination-toolbar">
    {controls && <div className="pagination-toolbar-controls">{controls}</div>}
    <div className="result-summary" aria-live="polite">Showing {from} to {to} of {totalCount}</div>
    <div className="pagination-toolbar-navigation">
      <PageSizeSelect ariaLabel={pageSizeAriaLabel} value={pageSize} onChange={onPageSizeChange} />
      <ResultPagination page={page} pageCount={pageCount} onChange={onPageChange} />
    </div>
  </div>;
}

export function ResultPagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  const atFirstPage = page <= 1;
  const atLastPage = page >= pageCount;

  return <nav className="result-pagination" aria-label="Results pagination">
    <button type="button" aria-label="First page" title="First page" disabled={atFirstPage} onClick={() => onChange(1)}><ChevronFirst aria-hidden="true" size={18} /></button>
    <button type="button" aria-label="Previous page" title="Previous page" disabled={atFirstPage} onClick={() => onChange(page - 1)}><ChevronLeft aria-hidden="true" size={18} /></button>
    <span className="mobile-page-label">Page {page} of {pageCount}</span>
    <div className="numbered-pages">
      {pageNumbers(page, pageCount).map((token, index) => token === "ellipsis"
        ? <span className="page-ellipsis" aria-hidden="true" key={`ellipsis-${index}`}>…</span>
        : <button type="button" key={token} aria-label={`Page ${token}`} aria-current={page === token ? "page" : undefined} className={page === token ? "active" : ""} onClick={() => onChange(token)}>{token}</button>)}
    </div>
    <button type="button" aria-label="Next page" title="Next page" disabled={atLastPage} onClick={() => onChange(page + 1)}><ChevronRight aria-hidden="true" size={18} /></button>
    <button type="button" aria-label="Last page" title="Last page" disabled={atLastPage} onClick={() => onChange(pageCount)}><ChevronLast aria-hidden="true" size={18} /></button>
  </nav>;
}
