"use client";

import {
        useState,
        useCallback,
        useEffect,
        useRef,
        useContext,
        createContext,
        type ReactNode,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
        ChevronLeft, 
        ChevronRight, 
        Search, 
        ChevronDown,
        Eye,
        Pencil,
        Trash2,
        X,
        AlertTriangle, 
} from "lucide-react";
import Link from "next/link";
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import {
        Sheet,
        SheetContent,
        SheetHeader,
        SheetTitle,
} from "@/components/ui/sheet";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ColumnDef<TRow> {
        key: string;
        header?: ReactNode;
        className?: string;
        cell?: (row: TRow) => ReactNode;
}

export interface PaginationMeta {
        total: number;
        totalPages: number;
        rowsPerPage: number;
}

export interface SelectFilterItem {
        label: string;
        value: string;
}

export interface FilterDef<TRow> {
        paramKey: string;
        field: keyof TRow;
        /**
         * How to compare the filter value against the row field value.
         * - "exact" (default) — full string equality: "active" === "active"
         * - "floor" — Math.floor the row value then compare: Math.floor(4.8) === 4
         *             Use this for numeric ratings stored as decimal strings ("4.8").
         */
        matchMode?: "exact" | "floor";
}

/**
 * Describes one filterable field for useTableRows.
 * `paramKey` must match the paramKey used in the <SelectFilter> for that field.
 * `field`    is the key on TRow to compare against.
 */
export interface FilterDef<TRow> {
        paramKey: string;
        field: keyof TRow;
        /**
   * How to compare the filter value against the row field value.
   * - "exact" (default) — full string equality: "active" === "active"
   * - "floor" — Math.floor the row value then compare: Math.floor(4.8) === 4
   *             Use this for numeric ratings stored as decimal strings ("4.8").
   */
        matchMode?: "exact" | "floor";
}

// ─────────────────────────────────────────────────────────────────────────────
// Row action types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Eye icon.
 * - "link"  → renders a Next.js <Link>; parent provides the href per row.
 * - "popup" → renders a <button>; parent fires any side-effect (sheet, modal…)
 */
export type ViewAction<TRow> =
        | { type: "link"; href: (row: TRow) => string }
        | { type: "popup"; onClick: (row: TRow) => void }
        | {
                type: "sheet";
                /** Sheet header title. Defaults to "Details" if omitted. */
                title?: (row: TRow) => ReactNode;
                /** Sheet body content. */
                content: (row: TRow) => ReactNode;
        };

/**
 * Pencil icon.
 * - "dialog" (default) → opens the built-in Edit dialog; parent owns body + onConfirm.
 * - "link"              → renders a Next.js <Link> instead, no dialog at all.
 *                          Use when editing happens on its own page/route.
 */

export type EditAction<TRow> =
        | {
                type?: "dialog";
                /** Body rendered inside the dialog. ReactNode so the parent decides layout. */
                dialogContent: (row: TRow) => ReactNode;
                onConfirm: (row: TRow) => void;
                /** Confirm button label. Defaults to "Save changes". */
                confirmLabel?: string;
        }
        | {
                type: "link";
                href: (row: TRow) => string;
        };

/**
 * Trash icon — always opens the built-in Delete dialog.
 * Header is auto-generated: "Delete <dataType>?"
 * Parent owns the body copy and the confirm handler.
 */

/**
 * Trash icon — always opens the built-in Delete dialog.
 * Header is auto-generated: "Delete <dataType>?"
 * Parent owns the body copy and the confirm handler.
 */
export interface DeleteAction<TRow> {
        /**
         * Singular noun for the record type used in the dialog header.
         * e.g. dataType="Subscriber" → "Delete Subscriber?"
         */
        dataType: string;
        /** Body rendered inside the dialog. */
        dialogContent: (row: TRow) => ReactNode;
        onConfirm: (row: TRow) => void;
}

/**
 * Plain text link in the actions cell — no icon.
 * Use for "View details", "View receipt", "View more", etc.
 * Rendered as a Next.js <Link> after the icon group.
 */
export interface LinkAction<TRow> {
        /** Visible link text */
        label: string;
        /**
         * Returns the path + any *new* params to set (e.g. "/reviews?review=R-001").
         * When mergeParams is true (default), existing URL params are preserved and
         * only the params in this href are merged in — so table state (page, filters,
         * sort) is never lost.
         */
        href: (row: TRow) => string;
        /** Optional icon rendered after the label text. */
        linkIcon?: ReactNode;
        /**
         * When true (default), merges the href params into the current URL instead of
         * replacing them — preserving table state (pagination, filters, sort).
         * Set to false to navigate to the exact href as-is.
         */
        mergeParams?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// TableIdContext
// ─────────────────────────────────────────────────────────────────────────────

const TableIdContext = createContext<string>("");

// ─────────────────────────────────────────────────────────────────────────────
// useTableParam  — namespaced URL-param hook
// ─────────────────────────────────────────────────────────────────────────────

function useTableParam(tableId: string) {
        const router = useRouter();
        const pathname = usePathname();
        const searchParams = useSearchParams();

        const ns = useCallback((key: string) => `${tableId}_${key}`, [tableId]);

        const setParam = useCallback(
                (key: string, value: string) => {
                        const params = new URLSearchParams(searchParams.toString());
                        const nsKey = ns(key);
                        if (value) params.set(nsKey, value);
                        else params.delete(nsKey);
                        if (key !== "page") params.delete(ns("page"));
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                },
                [router, pathname, searchParams, ns],
        );

        const getParam = useCallback(
                (key: string) => searchParams.get(ns(key)),
                [searchParams, ns],
        );

        return { getParam, setParam };
}

// ─────────────────────────────────────────────────────────────────────────────
// useTableRows
//
// Client-side filtering + pagination driven entirely by the namespaced URL
// params of a given tableId. Use this when data lives in the client (mock /
// already-fetched). For server-side data, skip this and re-fetch on param
// change instead.
//
// Usage:
//   const { rows, pagination } = useTableRows({
//     tableId: "subscribers",
//     data: MOCK_SUBSCRIBERS,
//     searchFields: ["organization", "ownerEmail", "id"],
//     filters: [
//       { paramKey: "status", field: "status" },
//       { paramKey: "plan",   field: "plan"   },
//     ],
//     rowsPerPage: 10,
//   });
// ─────────────────────────────────────────────────────────────────────────────

export interface UseTableRowsOptions<TRow> {
        tableId: string;
        /** Full unfiltered dataset */
        data: TRow[];
        /** Row fields to match the search query against (case-insensitive substring) */
        searchFields?: (keyof TRow)[];
        /** Select-filter bindings */
        filters?: FilterDef<TRow>[];
        rowsPerPage?: number;
        /**
         * The date field to sort by when a <DateSortFilter> is present in the
         * toolbar. Only provide this for tables that have date data.
         * The field value must be parseable by `new Date()`.
         * e.g. sortField: "joinedDate"
         */
        sortField?: keyof TRow;
}

export function useTableRows<TRow extends { id: string }>({
        tableId,
        data,
        searchFields = [],
        filters = [],
        rowsPerPage = 10,
        sortField,
}: UseTableRowsOptions<TRow>): { rows: TRow[]; pagination: PaginationMeta } {
        const { getParam } = useTableParam(tableId);

        const search = (getParam("search") ?? "").toLowerCase().trim();
        const page = Math.max(1, Number(getParam("page") ?? 1));
        // "newest" | "oldest" | "" — only applied when sortField is provided
        const sort = sortField ? (getParam("sort") ?? "") : "";

        // 1. Search filter
        let result = data;
        if (search && searchFields.length > 0) {
                result = result.filter((row) =>
                        searchFields.some((field) =>
                                String(row[field] ?? "").toLowerCase().includes(search),
                        ),
                );
        }

        // 2. Select filters
        for (const { paramKey, field, matchMode = "exact" } of filters) {
                const value = getParam(paramKey) ?? "";
                if (!value) continue;
                result = result.filter((row) => {
                        const raw = String(row[field] ?? "");
                        if (matchMode === "floor") {
                                return String(Math.floor(parseFloat(raw))) === value;
                        }
                        return raw === value;
                });
        }

        // 3. Date sort — only runs when sortField is declared on useTableRows
        if (sortField && sort) {
                result = [...result].sort((a, b) => {
                        const da = new Date(a[sortField] as string).getTime();
                        const db = new Date(b[sortField] as string).getTime();
                        return sort === "oldest" ? da - db : db - da; // default: newest first
                });
        }

        // 4. Pagination
        const total = result.length;
        const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * rowsPerPage;
        const rows = result.slice(start, start + rowsPerPage);

        return { rows, pagination: { total, totalPages, rowsPerPage } };
}

// ─────────────────────────────────────────────────────────────────────────────
// exportToCSV  — generic, works with any array of objects
//
// Usage:
//   exportToCSV(rows)
//   exportToCSV(rows, { filename: "subscribers-export" })
//   exportToCSV(rows, { columns: ["organization", "plan", "status"] })
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportCSVOptions {
        /** File name without extension. Defaults to "export-<timestamp>" */
        filename?: string;
        /**
         * Subset of keys to include, in order. Defaults to all keys
         * from the first row.
         */
        columns?: string[];
}

export function exportToCSV<TRow extends object>(
        rows: TRow[],
        options: ExportCSVOptions = {},
): void {
        if (rows.length === 0) return;

        const keys = (options.columns ?? Object.keys(rows[0])) as (keyof TRow)[];
        const filename = options.filename ?? `export-${Date.now()}`;

        // Header row — turn camelCase / snake_case into "Title Case"
        const toTitle = (key: string) =>
                key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase())
                        .trim();

        const escape = (val: unknown) => {
                const str = val == null ? "" : String(val);
                // Wrap in quotes if the value contains a comma, quote, or newline
                return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
        };

        const header = keys.map((k) => toTitle(String(k))).join(",");
        const body = rows
                .map((row) => keys.map((k) => escape(row[k])).join(","))
                .join("\n");

        const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// SearchInput
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchInputProps {
        placeholder?: string;
        paramKey?: string;
}

export function SearchInput({
        placeholder = "Search...",
        paramKey = "search",
}: SearchInputProps) {
        const tableId = useContext(TableIdContext);
        const { getParam, setParam } = useTableParam(tableId);
        const value = getParam(paramKey) ?? "";

        return (
                <div className="relative flex items-center w-full max-w-sm">
                        <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
                        <input
                                type="text"
                                value={value}
                                onChange={(e) => setParam(paramKey, e.target.value)}
                                placeholder={placeholder}
                                className={[
                                        "w-full pl-9 pr-4 py-2 rounded-xs cursor-pointer",
                                        "bg-gray-50 border border-gray-300",
                                        "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
                                        "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                        "transition-all duration-300",
                                ].join(" ")}
                        />
                </div>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// SelectFilter
// ─────────────────────────────────────────────────────────────────────────────

export interface SelectFilterProps {
        title: string;
        items: SelectFilterItem[];
        paramKey: string;
}

export function SelectFilter({ title, items, paramKey }: SelectFilterProps) {
        const tableId = useContext(TableIdContext);
        const { getParam, setParam } = useTableParam(tableId);
        const active = getParam(paramKey) ?? "";
        const [open, setOpen] = useState(false);
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
                const handler = (e: MouseEvent) => {
                        if (ref.current && !ref.current.contains(e.target as Node)) {
                                setOpen(false);
                        }
                };
                document.addEventListener("mousedown", handler);
                return () => document.removeEventListener("mousedown", handler);
        }, []);

        const activeLabel = items.find((i) => i.value === active)?.label ?? title;

        return (
                <div ref={ref} className="relative">
                        <button
                                onClick={() => setOpen((o) => !o)}
                                className={[
                                        "flex items-center gap-2 px-3 py-2 rounded-xs text-xs font-medium font-text cursor-pointer",
                                        "border transition-all duration-300 whitespace-nowrap",
                                        active
                                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                                : "bg-gray-50 border-gray-300 text-[#0B0B0B]/50 hover:border-gray-400",
                                ].join(" ")}
                        >
                                {activeLabel}
                                <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                        </button>

                        {open && (
                                <div className="absolute top-full mt-1 left-0 z-50 min-w-35 bg-white border border-gray-200 rounded-lg shadow-lg py-1 overflow-hidden">
                                        <button
                                                onClick={() => { setParam(paramKey, ""); setOpen(false); }}
                                                className={[
                                                        "w-full text-left px-3 py-2 text-xs font-text transition-colors cursor-pointer",
                                                        !active ? "text-blue-700 bg-blue-50" : "text-gray-700 hover:bg-gray-50",
                                                ].join(" ")}
                                        >
                                                {title}
                                        </button>
                                        {items.map((item) => (
                                                <button
                                                        key={item.value}
                                                        onClick={() => { setParam(paramKey, item.value); setOpen(false); }}
                                                        className={[
                                                                "w-full text-left px-3 py-2 text-xs font-text transition-colors",
                                                                active === item.value
                                                                        ? "text-blue-700 bg-blue-50"
                                                                        : "text-gray-700 hover:bg-gray-50",
                                                        ].join(" ")}
                                                >
                                                        {item.label}
                                                </button>
                                        ))}
                                </div>
                        )}
                </div>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// TableToolbar
// ─────────────────────────────────────────────────────────────────────────────

export interface TableToolbarProps {
        search?: SearchInputProps;
        /** Up to 3 select filters */
        filters?: SelectFilterProps[];
        /**
         * Enable the "Sort by date" toggle.
         * Only meaningful when `sortField` is also declared on useTableRows.
         */
        dateSort?: boolean;
        actions?: ReactNode;
}

export function TableToolbar({ search, filters = [], dateSort = false, actions }: TableToolbarProps) {
        return (
                <div className="p-4 my-4 mt-4 md:mb-6 bg-white rounded-[10px] border border-gray-200">
                        <div className="flex flex-wrap gap-4 items-center">
                                {search && <SearchInput {...search} />}
                                {filters.slice(0, 3).map((f) => (
                                        <SelectFilter key={f.paramKey} {...f} />
                                ))}
                                {dateSort && <DateSortFilter />}
                                {actions && <div className="flex items-center gap-3 ml-auto">{actions}</div>}
                        </div>
                </div>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// DateSortFilter
//
// A toolbar toggle that writes `${tableId}_sort` = "newest" | "oldest" to the
// URL. It is intentionally a separate component from SelectFilter so TypeScript
// makes it impossible to add to a table without also declaring `sortField` on
// useTableRows — keeping the contract explicit.
//
// Usage in TableToolbar:  dateSort={true}
// ─────────────────────────────────────────────────────────────────────────────

function DateSortFilter() {
        const tableId = useContext(TableIdContext);
        const { getParam, setParam } = useTableParam(tableId);
        const active = getParam("sort") ?? "";
        const [open, setOpen] = useState(false);
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
                const handler = (e: MouseEvent) => {
                        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
                };
                document.addEventListener("mousedown", handler);
                return () => document.removeEventListener("mousedown", handler);
        }, []);

        const options = [
                { label: "Newest first", value: "newest" },
                { label: "Oldest first", value: "oldest" },
        ];

        const activeLabel = options.find((o) => o.value === active)?.label ?? "Sort by date";

        return (
                <div ref={ref} className="relative">
                        <button
                                onClick={() => setOpen((o) => !o)}
                                className={[
                                        "flex items-center gap-2 px-3 py-2 rounded-xs text-xs font-medium font-text cursor-pointer",
                                        "border transition-all duration-300 whitespace-nowrap",
                                        active
                                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                                : "bg-gray-50 border-gray-300 text-[#0B0B0B]/50 hover:border-gray-400",
                                ].join(" ")}
                        >
                                {activeLabel}
                                <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                        </button>

                        {open && (
                                <div className="absolute top-full mt-1 left-0 z-50 min-w-37 bg-white border border-gray-200 rounded-lg shadow-lg py-1 overflow-hidden">
                                        {/* Reset option */}
                                        <button
                                                onClick={() => { setParam("sort", ""); setOpen(false); }}
                                                className={[
                                                        "w-full text-left px-3 py-2 text-xs font-text transition-colors",
                                                        !active ? "text-blue-700 bg-blue-50" : "text-gray-700 hover:bg-gray-50",
                                                ].join(" ")}
                                        >
                                                Sort by date
                                        </button>
                                        {options.map((opt) => (
                                                <button
                                                        key={opt.value}
                                                        onClick={() => { setParam("sort", opt.value); setOpen(false); }}
                                                        className={[
                                                                "w-full text-left px-3 py-2 text-xs font-text transition-colors",
                                                                active === opt.value
                                                                        ? "text-blue-700 bg-blue-50"
                                                                        : "text-gray-700 hover:bg-gray-50",
                                                        ].join(" ")}
                                                >
                                                        {opt.label}
                                                </button>
                                        ))}
                                </div>
                        )}
                </div>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// TableDialog — internal shared dialog shell
// Used for both Edit and Delete. Renders a backdrop + card with:
//   • Fixed header (title from DataTable, X close button)
//   • Scrollable body (ReactNode from parent via action config)
//   • Fixed footer (Cancel + Confirm; styles differ by variant)
// ─────────────────────────────────────────────────────────────────────────────

interface TableDialogProps {
        open: boolean;
        onClose: () => void;
        onConfirm: () => void;
        title: string;
        confirmLabel: string;
        /** "edit" = blue confirm, "delete" = red confirm */
        variant: "edit" | "delete";
        children: ReactNode;
}

function TableDialog({
        open,
        onClose,
        onConfirm,
        title,
        confirmLabel,
        variant,
        children,
}: TableDialogProps) {
        // Close on Escape
        useEffect(() => {
                if (!open) return;
                const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
                document.addEventListener("keydown", handler);
                return () => document.removeEventListener("keydown", handler);
        }, [open, onClose]);

        if (!open) return null;

        const confirmClass =
                variant === "delete"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white";

        return (
                /* Backdrop */
                <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                        {/* Card */}
                        <div className="relative w-full max-w-md bg-white rounded-[10px] shadow-xl flex flex-col overflow-hidden">

                                {/* Header */}
                                <div className={[
                                        "flex items-center justify-between px-6 py-4 border-b border-gray-100",
                                        variant === "delete" ? "bg-red-50" : "bg-white",
                                ].join(" ")}>
                                        <div className="flex items-center gap-2">
                                                {variant === "delete" && (
                                                        <span className="flex items-center justify-center size-6 rounded-full bg-red-100">
                                                                <AlertTriangle className="size-3 text-red-600" />
                                                        </span>
                                                )}
                                                <h2 className={[
                                                        "text-sm font-semibold font-text",
                                                        variant === "delete" ? "text-red-500" : "text-neutral-800",
                                                ].join(" ")}>
                                                        {title}
                                                </h2>
                                        </div>
                                        <button
                                                onClick={onClose}
                                                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 duration-300 transition-colors cursor-pointer"
                                        >
                                                <X className="size-4" />
                                        </button>
                                </div>

                                {/* Body — parent-supplied ReactNode */}
                                <div className="px-6 py-5 text-sm text-gray-600 font-text leading-relaxed">
                                        {children}
                                </div>

                                {/* Footer — always Cancel + Confirm */}
                                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                                        <button
                                                onClick={onClose}
                                                className="px-5 py-2 rounded-xs text-sm font-medium font-text text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                                Cancel
                                        </button>
                                        <button
                                                onClick={onConfirm}
                                                className={`px-5 py-2 rounded-xs text-sm font-medium font-text transition-colors cursor-pointer ${confirmClass}`}
                                        >
                                                {confirmLabel}
                                        </button>
                                </div>
                        </div>
                </div>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// LinkActionCell
// Separate component so it can call useSearchParams (a hook) inside a row
// render without violating the rules-of-hooks ordering in DataTable itself.
// ─────────────────────────────────────────────────────────────────────────────

function LinkActionCell<TRow extends { id: string }>({
        row,
        action,
}: {
        row: TRow;
        action: LinkAction<TRow>;
}) {
        const searchParams = useSearchParams();
        const { mergeParams = true, linkIcon } = action;

        const rawHref = action.href(row);

        const finalHref = (() => {
                if (!mergeParams) return rawHref;
                // Parse the href the parent gave us
                const [rawPath, rawQuery] = rawHref.split("?");
                // Start from the current URL params to preserve table state
                const merged = new URLSearchParams(searchParams.toString());
                // Overlay the params from the parent href
                new URLSearchParams(rawQuery ?? "").forEach((v, k) => merged.set(k, v));
                const qs = merged.toString();
                return qs ? `${rawPath}?${qs}` : rawPath;
        })();

        return (
                <Link
                        href={finalHref}
                        className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors whitespace-nowrap"
                >
                        {action.label}
                        {linkIcon && <span className="opacity-70">{linkIcon}</span>}
                </Link>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// TableSkeletonRows
// ─────────────────────────────────────────────────────────────────────────────

function TableSkeletonRows({ cols }: { cols: number }) {
        return (
                <>
                        {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                        {Array.from({ length: cols }).map((_, j) => (
                                                <TableCell key={j}>
                                                        <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4" />
                                                </TableCell>
                                        ))}
                                </TableRow>
                        ))}
                </>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// DataTable
// ─────────────────────────────────────────────────────────────────────────────

export interface DataTableProps<TRow extends { id: string }> {
        tableId: string;
        columns: ColumnDef<TRow>[];
        rows: TRow[];
        pagination: PaginationMeta;
        toolbar?: ReactNode;
        loading?: boolean;
        emptyMessage?: string;
        /** Eye icon — "link" navigates, "popup" fires onClick */
        viewAction?: ViewAction<TRow>;
        /** Pencil icon — opens Edit dialog with parent-supplied body */
        editAction?: EditAction<TRow>;
        /** Trash icon — opens Delete confirmation dialog */
        deleteAction?: DeleteAction<TRow>;
        /** Plain text link in the actions cell — no icon */
        linkAction?: LinkAction<TRow>;
}

export function DataTable<TRow extends { id: string }>({
        tableId,
        columns,
        rows,
        pagination,
        toolbar,
        viewAction,
        editAction,
        deleteAction,
        linkAction,
        loading = false,
        emptyMessage = "No results match your filters.",
}: DataTableProps<TRow>) {
        const { getParam, setParam } = useTableParam(tableId);

        const page = Math.max(1, Number(getParam("page") ?? 1));
        const totalPages = Math.max(1, pagination.totalPages);
        const { rowsPerPage, total } = pagination;

        const goToPage = (p: number) => setParam("page", String(p));

        const paginationLabel =
                total === 0
                        ? "0 results"
                        : `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, total)} of ${total}`;

        // ── Dialog state ────────────────────────────────────────────────────────
        type PanelKind = "edit" | "delete" | "sheet" | null;
        const [activeRow, setActiveRow] = useState<TRow | null>(null);
        const [panelKind, setPanelKind] = useState<PanelKind>(null);

        const openPanel = (kind: Exclude<PanelKind, null>, row: TRow) => {
                setActiveRow(row);
                setPanelKind(kind);
        };
        const closePanel = () => {
                setPanelKind(null);
                setActiveRow(null);
        };

        const handleEditConfirm = () => {
                if (activeRow && editAction && editAction.type !== "link") {
                        editAction.onConfirm(activeRow);
                        closePanel();
                }
        };
        const handleDeleteConfirm = () => {
                if (activeRow && deleteAction) { deleteAction.onConfirm(activeRow); closePanel(); }
        };

        const hasActions = Boolean(viewAction || editAction || deleteAction || linkAction);

        const colCount = columns.length + (hasActions ? 1 : 0);

        return (
                <TableIdContext.Provider value={tableId}>
                        {toolbar}

                        <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
                                <Table>
                                        <TableHeader>
                                                <TableRow>
                                                        {columns.map((col) => (
                                                                <TableHead key={col.key} className={`px-3 md:px-6 text-gray-500 text-xs font-semibold font-text uppercase ${col.className}`}>
                                                                        {col.header ?? col.key}
                                                                </TableHead>
                                                        ))}
                                                        {hasActions && <TableHead className="w-28">Actions</TableHead>}
                                                </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                                {loading ? (
                                                        <TableSkeletonRows cols={colCount} />
                                                ) : rows.length === 0 ? (
                                                        <TableRow>
                                                                <TableCell colSpan={colCount} className="text-center px-3 md:px-6 py-8 md:py-16 text-gray-400 text-sm">
                                                                        {emptyMessage}
                                                                </TableCell>
                                                        </TableRow>
                                                ) : (
                                                        rows.map((row) => (
                                                                <TableRow key={row.id}>
                                                                        {columns.map((col) => (
                                                                                <TableCell key={col.key} className={`px-3 md:px-6 py-4 text-sm font-text leading-5 ${col.className}`}>
                                                                                        {col.cell
                                                                                                ? col.cell(row)
                                                                                                : String((row as Record<string, unknown>)[col.key] ?? "")}
                                                                                </TableCell>
                                                                        ))}
                                                                        {/* ── Actions cell ──────────────────────────────────── */}
                                                                        {hasActions && (
                                                                                <TableCell>
                                                                                        <div className="flex items-center gap-1">

                                                                                                {/* Eye — link, popup, or sheet — parent decides */}
                                                                                                {viewAction && (
                                                                                                        viewAction.type === "link" ? (
                                                                                                                <Link
                                                                                                                        href={viewAction.href(row)}
                                                                                                                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                                                                                                        title="View"
                                                                                                                >
                                                                                                                        <Eye className="size-4 text-gray-500" />
                                                                                                                </Link>
                                                                                                        ) : viewAction.type === "sheet" ? (
                                                                                                                <button
                                                                                                                        onClick={() => openPanel("sheet", row)}
                                                                                                                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                                                                                                        title="View"
                                                                                                                >
                                                                                                                        <Eye className="size-4 text-gray-500" />
                                                                                                                </button>
                                                                                                        ) : (
                                                                                                                <button
                                                                                                                        onClick={() => viewAction.onClick(row)}
                                                                                                                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                                                                                                        title="View"
                                                                                                                >
                                                                                                                        <Eye className="size-4 text-gray-500" />
                                                                                                                </button>
                                                                                                        )
                                                                                                )}

                                                                                                {/* Pencil — opens Edit dialog, or navigates if type is "link" */}
                                                                                                {editAction && (
                                                                                                        editAction.type === "link" ? (
                                                                                                                <Link
                                                                                                                        href={editAction.href(row)}
                                                                                                                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                                                                                                        title="Edit"
                                                                                                                >
                                                                                                                        <Pencil className="size-4 text-gray-500" />
                                                                                                                </Link>
                                                                                                        ) : (
                                                                                                                <button
                                                                                                                        onClick={() => openPanel("edit", row)}
                                                                                                                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                                                                                                                        title="Edit"
                                                                                                                >
                                                                                                                        <Pencil className="size-4 text-gray-500" />
                                                                                                                </button>
                                                                                                        )
                                                                                                )}

                                                                                                {/* Trash — opens Delete dialog */}
                                                                                                {deleteAction && (
                                                                                                        <button
                                                                                                                onClick={() => openPanel("delete", row)}
                                                                                                                className="p-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                                                                                                title="Delete"
                                                                                                        >
                                                                                                                <Trash2 className="size-4 text-red-400" />
                                                                                                        </button>
                                                                                                )}

                                                                                                {/* Text link — no icon, sits after the icon group */}
                                                                                                {linkAction && (
                                                                                                        <LinkActionCell row={row} action={linkAction} />
                                                                                                )}

                                                                                        </div>
                                                                                </TableCell>
                                                                        )}
                                                                </TableRow>
                                                        ))
                                                )}
                                        </TableBody>
                                </Table>

                                {/* Pagination */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-sm font-normal font-text">Rows per page:</span>
                                                <span className="px-2.5 py-1 rounded-lg border border-gray-200 text-sm text-neutral-800">
                                                        {rowsPerPage}
                                                </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-500">{paginationLabel}</span>
                                                <button
                                                        onClick={() => goToPage(page - 1)}
                                                        disabled={page <= 1}
                                                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        <ChevronLeft className="size-4 text-gray-600" />
                                                </button>
                                                <button
                                                        onClick={() => goToPage(page + 1)}
                                                        disabled={page >= totalPages}
                                                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        <ChevronRight className="size-4 text-gray-600" />
                                                </button>
                                        </div>
                                </div>
                        </div>

                        {/* Edit dialog — only rendered when editAction is the dialog variant */}
                        {editAction && editAction.type !== "link" && (
                                <TableDialog
                                        open={panelKind === "edit"}
                                        onClose={closePanel}
                                        onConfirm={handleEditConfirm}
                                        variant="edit"
                                        title="Edit details"
                                        confirmLabel={editAction.confirmLabel ?? "Save changes"}
                                >
                                        {activeRow ? editAction.dialogContent(activeRow) : null}
                                </TableDialog>
                        )}

                        {/* Delete dialog */}
                        {deleteAction && (
                                <TableDialog
                                        open={panelKind === "delete"}
                                        onClose={closePanel}
                                        onConfirm={handleDeleteConfirm}
                                        variant="delete"
                                        title={`Delete ${deleteAction.dataType}?`}
                                        confirmLabel="Delete"
                                >
                                        {activeRow ? deleteAction.dialogContent(activeRow) : null}
                                </TableDialog>
                        )}

                        {/* View sheet — shadcn Sheet sliding in from the right */}
                        {viewAction && viewAction.type === "sheet" && (
                                <Sheet 
                                        open={panelKind === "sheet"} 
                                        onOpenChange={(open) => { if (!open) closePanel(); }}
                                >
                                        <SheetContent side="right" className="md:min-w-xl overflow-y-auto">
                                                <SheetHeader className="sticky top-0 bg-white">
                                                        <SheetTitle className="text-neutral-950 text-base font-bold font-text">
                                                                {activeRow ? (viewAction.title?.(activeRow) ?? "Details") : "Details"}
                                                        </SheetTitle>
                                                </SheetHeader>
                                                <div className="px-4 pb-6">
                                                        {activeRow ? viewAction.content(activeRow) : null}
                                                </div>
                                        </SheetContent>
                                </Sheet>
                        )}
                </TableIdContext.Provider>
        );
}