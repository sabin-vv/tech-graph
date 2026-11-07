import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from "react"

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className = "", wrapperClassName = "", ...props }, ref) => (
    <div className={`w-full overflow-x-auto ${wrapperClassName}`}>
      <table
        ref={ref}
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      />
    </div>
  ),
)
Table.displayName = "Table"

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <thead
    ref={ref}
    className={`border-border border-b [&_tr]:border-b ${className}`}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <tbody
    ref={ref}
    className={`[&_tr:last-child]:border-0 ${className}`}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <tfoot
    ref={ref}
    className={`border-border bg-surface/50 border-t font-medium ${className}`}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className = "", ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-border hover:bg-surface-hover border-b transition-colors ${className}`}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className = "", ...props }, ref) => (
  <th
    ref={ref}
    className={`text-text-secondary h-10 px-3 text-left align-middle text-xs font-medium tracking-wider uppercase has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5 ${className}`}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className = "", ...props }, ref) => (
  <td
    ref={ref}
    className={`px-3 py-3 align-middle has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5 ${className}`}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className = "", ...props }, ref) => (
  <caption
    ref={ref}
    className={`text-text-secondary mt-4 text-sm ${className}`}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
