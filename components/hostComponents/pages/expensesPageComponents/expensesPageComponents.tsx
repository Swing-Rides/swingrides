"use client";

import { ReactNode, Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageWrapper from "../../dashboard/pageWrapper";
import { Download, X } from "lucide-react";
import AddExpenseForm, {
  AddExpenseFormValues,
} from "../../forms/addExpenseForm";
import { SelectOption } from "@/components/forms/types";
import AddTollRecordForm, {
  AddTollRecordFormValues,
} from "../../forms/addTollRecordForm";
import { useListVehcleQuery } from "@/app/store/services/hostApi";
import {
  useGetExpensesQuery,
  useGetFinanceSummaryQuery,
  useGetInvoicesQuery,
  useGetTollRecordsQuery,
  useLogExpenseMutation,
  useLogTollRecordMutation,
} from "@/app/store/services/expensesApi";
import {
  ColumnDef,
  DataTable,
  exportToCSV,
  TableToolbar,
  useTableRows,
} from "../../dashboard/customTable";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { ExpenseBarSegment } from "../../dashboard/dynamicImport";
import { ExpensesBarSegmentDataType } from "../../charts/expensesBarSegment";
import { toast } from "sonner";

// ─── Vehicle options — stable async fetcher ───────────────────────────────────

type VehicleOption = { label: string; value: string };

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  fuel: "#F97316",
  maintenance: "#EF4444",
  insurance: "#0891B2",
  cleaning: "#10B981",
  registration: "#7C3AED",
  parking: "#F59E0B",
  marketing: "#EC4899",
  office: "#6B7280",
  other: "#000000",
};

const normalizeExpenseCategory = (
  category: string,
): ExpensesRecordsCategoryType => {
  const normalized = category.toLowerCase();
  const allowed: ExpensesRecordsCategoryType[] = [
    "fuel",
    "maintenance",
    "insurance",
    "cleaning",
    "registration",
    "parking",
    "marketing",
    "office",
    "other",
  ];

  return allowed.includes(normalized as ExpensesRecordsCategoryType)
    ? (normalized as ExpensesRecordsCategoryType)
    : "other";
};

const normalizeInvoiceStatus = (status: string): InvoiceRecordsStatusType => {
  const normalized = status.toLowerCase();
  if (normalized === "paid") return "paid";
  if (normalized === "pending") return "pending";
  if (normalized === "refunded") return "refunded";
  if (normalized === "cancelled") return "cancelled";
  return "pending";
};

export default function ExpensesPageComponents() {
  const [logExpense] = useLogExpenseMutation();
  const [logTollRecord] = useLogTollRecordMutation();
  const { data: vehiclesResponse } = useListVehcleQuery({ page: 1, limit: 100 });

  const { data: summaryResponse, isLoading: isSummaryLoading } =
    useGetFinanceSummaryQuery();
  const { data: expensesResponse, isLoading: isExpensesLoading } =
    useGetExpensesQuery({ limit: 100 });
  const { data: invoicesResponse, isLoading: isInvoicesLoading } =
    useGetInvoicesQuery({ limit: 100 });
  const { data: tollRecordsResponse, isLoading: isTollRecordsLoading } =
    useGetTollRecordsQuery({ limit: 100 });

  const summary =
    summaryResponse?.data ??
    expensesResponse?.data.summary ??
    invoicesResponse?.data.summary ??
    tollRecordsResponse?.data.summary;

  const expensesBarData = useMemo<ExpensesBarSegmentDataType[]>(() => {
    const spendingByCategory = expensesResponse?.data.spendingByCategory;

    if (!spendingByCategory || spendingByCategory.length === 0) {
      return [];
    }

    return spendingByCategory.map((item) => ({
      name: item.category,
      value: item.amount,
      color: EXPENSE_CATEGORY_COLORS[item.category.toLowerCase()] ?? "#000000",
    }));
  }, [expensesResponse?.data.spendingByCategory]);

  const expensesRecordsData = useMemo<ExpensesRecordsRow[]>(() => {
    const items = expensesResponse?.data.table.items;
    if (!items || items.length === 0) return [];

    return items.map((item) => ({
      id: item.id,
      date: new Date(item.date).toISOString().split("T")[0],
      vehicleName: item.vehicle,
      category: normalizeExpenseCategory(item.category),
      description: item.description,
      amount: formatCurrency(item.amount),
      status: "logged",
    }));
  }, [expensesResponse?.data.table.items]);

  const invoiceRecordsData = useMemo<InvoiceRecordsRow[]>(() => {
    const items = invoicesResponse?.data.table.items;
    if (!items || items.length === 0) return [];

    return items.map((item) => ({
      id: item.invoiceNumber || item.id,
      customer: item.customer,
      vehicleName: item.vehicle,
      period: item.period,
      days: String(item.days),
      amount: formatCurrency(item.amount),
      status: normalizeInvoiceStatus(item.status),
    }));
  }, [invoicesResponse?.data.table.items]);

  const tollRecordsData = useMemo<TollRecordsRow[]>(() => {
    const items = tollRecordsResponse?.data.table.items;
    if (!items || items.length === 0) return [];

    return items.map((item) => ({
      id: item.id,
      dateTime: new Date(item.dateTime).toISOString(),
      vehicleName: item.vehicle,
      route: item.route,
      tollLocation: item.tollLocation,
      charge: formatCurrency(item.charge),
      linkedRental: item.linkedRental,
    }));
  }, [tollRecordsResponse?.data.table.items]);

  const vehicleOptions = useMemo<SelectOption[]>(() => {
    const hostVehicles = vehiclesResponse?.data ?? [];
    if (hostVehicles.length > 0) {
      return hostVehicles
        .map((vehicle) => ({
          label: `${vehicle.name} ${vehicle.year}`,
          value: vehicle.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    const merged = new Set<string>();

    if (merged.size === 0) {
      expensesRecordsData.forEach((row) => merged.add(row.vehicleName));
      tollRecordsData.forEach((row) => merged.add(row.vehicleName));
    }

    return Array.from(merged)
      .sort((a, b) => a.localeCompare(b))
      .map((vehicleName) => ({ label: vehicleName, value: vehicleName }));
  }, [
    vehiclesResponse?.data,
    expensesRecordsData,
    tollRecordsData,
  ]);

  const rentalOptions = useMemo<SelectOption[]>(() => {
    const invoiceItems = invoicesResponse?.data.table.items;

    if (!invoiceItems || invoiceItems.length === 0) {
      return invoiceRecordsData.map((invoice) => ({
        label: invoice.id,
        value: invoice.id,
      }));
    }

    return invoiceItems.map((invoice) => ({
      label: invoice.invoiceNumber,
      value: invoice.invoiceNumber,
    }));
  }, [invoicesResponse?.data.table.items, invoiceRecordsData]);

  // Stable reference — required so MainForm's useMemo-wrapped use() promise
  // doesn't get recreated (and re-suspended) on every render
  const fetchVehicles = useCallback(async (): Promise<VehicleOption[]> => {
    return vehicleOptions;
  }, [vehicleOptions]);

  const handleAddExpenseSubmit = useCallback(
    async (values: AddExpenseFormValues) => {
      await logExpense({
        vehicle: values.vehicle,
        category: values.category,
        description: values.description?.trim() || undefined,
        amount: values.amount,
        date: values.date,
      }).unwrap();
    },
    [logExpense],
  );

  const fetchRentals = useCallback(async (): Promise<SelectOption[]> => {
    return rentalOptions;
  }, [rentalOptions]);

  const handleAddTollSubmit = useCallback(
    async (values: AddTollRecordFormValues) => {
      await logTollRecord({
        vehicle: values.vehicle,
        charge: values.charge,
        dateTime: values.dateTime,
        route: values.route,
        tollLocation: values.tollLocation,
        linkedRental: values.linkedRental,
      }).unwrap();
    },
    [logTollRecord],
  );

  const isInitialLoading =
    isSummaryLoading &&
    isExpensesLoading &&
    isInvoicesLoading &&
    isTollRecordsLoading;

  if (isInitialLoading) {
    return (
      <PageWrapper
        pageTitle="Expenses & Invoices"
        pageDescription="Track spending, manage invoices, and monitor toll charges across your fleet."
      >
        <div className="p-6 text-sm text-gray-500">Loading finance data...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      pageTitle="Expenses & Invoices"
      pageDescription="Track spending, manage invoices, and monitor toll charges across your fleet."
    >
      <div className="mt-4 md:mt-8 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <OverviewCard
            label="Total Revenue"
            number={formatCurrency(summary?.totalRevenue ?? 0)}
            numberColor="text-emerald-500"
          />
          <OverviewCard
            label="Total Expenses"
            number={formatCurrency(summary?.totalExpenses ?? 0)}
            numberColor="text-red-500"
          />
          <OverviewCard
            label="Net Profit"
            number={formatCurrency(summary?.netProfit ?? 0)}
            numberColor="text-blue-500"
          />
          <OverviewCard
            label="Pending Invoices"
            number={formatCurrency(summary?.pendingInvoices ?? 0)}
            numberColor="text-amber-500"
          />
        </div>
        <Suspense>
          <ExpensesPageTabs
            fetchVehicles={fetchVehicles}
            fetchRentals={fetchRentals}
            onAddToll={handleAddTollSubmit}
            onAddExpense={handleAddExpenseSubmit}
            expensesBarSegmentData={expensesBarData}
            expensesRecordsTableData={expensesRecordsData}
            invoiceRecordsTableData={invoiceRecordsData}
            tollRecordsTableData={tollRecordsData}
          />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

// ─── Overview card ────────────────────────────────────────────────────────────

type OverviewCardProps = {
  label: string;
  number: string;
  numberColor: string;
};

const OverviewCard = ({ label, number, numberColor }: OverviewCardProps) => {
  return (
    <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2 space-y-2">
      <div className="flex flex-col gap-2 justify-start items-start">
        <h4 className="text-gray-500 text-xs font-semibold font-text uppercase">
          {label}
        </h4>
        <span
          className={`text-lg md:text-3xl font-medium font-text ${numberColor}`}
        >
          {number}
        </span>
      </div>
    </div>
  );
};

// ─── Tab nav config ───────────────────────────────────────────────────────────

const expensesTabTitle = [
  { value: "expenses", title: "Expenses" },
  { value: "invoices", title: "Invoices" },
  { value: "tollRecords", title: "Toll Records" },
];

type ExpensesPageTabsProps = {
  fetchVehicles: () => Promise<VehicleOption[]>;
  onAddExpense: (values: AddExpenseFormValues) => void | Promise<void>;
  expensesBarSegmentData: ExpensesBarSegmentDataType[];
  expensesRecordsTableData: ExpensesRecordsRow[];
  fetchRentals: () => Promise<SelectOption[]>;
  invoiceRecordsTableData: InvoiceRecordsRow[];
  onAddToll: (values: AddTollRecordFormValues) => void | Promise<void>;
  tollRecordsTableData: TollRecordsRow[];
};

const ExpensesPageTabs = ({
  fetchVehicles,
  onAddExpense,
  expensesBarSegmentData,
  expensesRecordsTableData,
  fetchRentals,
  invoiceRecordsTableData,
  onAddToll,
  tollRecordsTableData,
}: ExpensesPageTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "expenses";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full space-y-4 md:space-y-6"
    >
      <TabsList variant="line" className="gap-20 border-b-2">
        {expensesTabTitle.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex gap-2 item-center justify-start data-[state=active]:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700 cursor-pointer"
          >
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="expenses">
        <ExpensesTab
          fetchVehicles={fetchVehicles}
          onAddExpense={onAddExpense}
          expensesBarSegmentData={expensesBarSegmentData}
          tableData={expensesRecordsTableData}
        />
      </TabsContent>
      <TabsContent value="invoices">
        <InvoicesTab tableData={invoiceRecordsTableData} />
      </TabsContent>
      <TabsContent value="tollRecords">
        <TollTab
          fetchRentals={fetchRentals}
          fetchVehicles={fetchVehicles}
          onAddToll={onAddToll}
          tableData={tollRecordsTableData}
        />
      </TabsContent>
    </Tabs>
  );
};

// ─── Reusable popup-with-form section ─────────────────────────────────────────

type TabTitleSectionProps = {
  title: string;
  buttonLabel: string;
  formTitle: string;
  formDescription: string;
  children: ReactNode | ((closePopup: () => void) => ReactNode);
};

const TabTitleSection = ({
  title,
  buttonLabel,
  formTitle,
  formDescription,
  children,
}: TabTitleSectionProps) => {
  const [formPopup, setFormPopup] = useState(false);

  const handlePopupState = useCallback(() => setFormPopup((prev) => !prev), []);
  const closePopup = useCallback(() => setFormPopup(false), []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-neutral-950 text-xl font-semibold font-text">
          {title}
        </h3>
        <button
          className="px-6 py-2 bg-blue-700 rounded-xs text-center justify-center text-white text-sm font-semibold font-text capitalize cursor-pointer hover:bg-blue-900 duration-300 transition-colors"
          onClick={handlePopupState}
        >
          {buttonLabel}
        </button>
      </div>

      {formPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 pt-5 pb-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm md:text-[20px] font-semibold font-text text-neutral-900">
                    {formTitle}
                  </h3>
                  {formDescription && (
                    <span className="text-sm font-normal font-text text-gray-400 text-center block">
                      {formDescription}
                    </span>
                  )}
                </div>
                <button
                  onClick={closePopup}
                  className="flex items-center justify-center size-7 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="size-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 md:px-5 py-4 flex flex-col gap-4">
              {typeof children === "function" ? children(closePopup) : children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Expenses tab ─────────────────────────────────────────────────────────────

type ExpensesTabProps = {
  fetchVehicles: () => Promise<VehicleOption[]>;
  onAddExpense: (values: AddExpenseFormValues) => void | Promise<void>;
  expensesBarSegmentData: ExpensesBarSegmentDataType[];
  tableData: ExpensesRecordsRow[];
};

const ExpensesTab = ({
  fetchVehicles,
  onAddExpense,
  expensesBarSegmentData,
  tableData,
}: ExpensesTabProps) => {
  return (
    <div className="space-y-4">
      <TabTitleSection
        title="Add an expense"
        buttonLabel="Add Expense"
        formTitle="Add Expense"
        formDescription="Log a new expense for your fleet"
      >
        {(closePopup) => (
          <AddExpenseForm
            fetchVehicles={fetchVehicles}
            onCancel={closePopup}
            onSubmit={async (values) => {
              await onAddExpense(values);
              closePopup();
              toast.success("Expense Added", {
                description: "You can refresh the page to see the updated data.",
              });
            }}
          />
        )}
      </TabTitleSection>
      <ExpenseBarSegment data={expensesBarSegmentData} />
      <ExpensesRecordsTable tableData={tableData} />
    </div>
  );
};

type ExpensesRecordsCategoryType =
  | "fuel"
  | "maintenance"
  | "insurance"
  | "cleaning"
  | "registration"
  | "parking"
  | "marketing"
  | "office"
  | "other";

interface ExpensesRecordsRow {
  id: string;
  date: string;
  vehicleName: string;
  category: ExpensesRecordsCategoryType;
  description: string;
  amount: string;
  status: "logged";
}

const ExpensesRecordCategoryBadge = ({
  category,
}: {
  category: ExpensesRecordsCategoryType;
}) => {
  const styles: Record<string, string> = {
    fuel: "bg-orange-500/10 text-orange-500",
    maintenance: "bg-red-500/10 text-red-500",
    insurance: "bg-cyan-600/10 text-cyan-600",
    cleaning: "bg-emerald-500/10 text-emerald-500",
    registration: "bg-violet-600/10 text-violet-600",
    parking: "bg-amber-500/10 text-amber-500",
    marketing: "bg-pink-500/10 text-pink-500",
    office: "bg-black/10 text-black",
    other: "bg-black text-white",
  };

  return (
    <span
      className={`flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium font-text leading-4 capitalize ${styles[category] ?? styles.other}`}
    >
      {category}
    </span>
  );
};

const expensesRecordsRowColumns: ColumnDef<ExpensesRecordsRow>[] = [
  {
    key: "date",
    header: "Date",
    cell: (row) => (
      <span className="text-gray-800 text-sm font-normal font-text leading-5">
        {row.date}
      </span>
    ),
  },
  {
    key: "vehicleName",
    header: "Vehicle",
    cell: (row) => (
      <span className="text-gray-800 text-sm font-normal font-text leading-5">
        {row.vehicleName}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    cell: (row) => <ExpensesRecordCategoryBadge category={row.category} />,
  },
  {
    key: "description",
    header: "Description",
    cell: (row) => (
      <span className="text-gray-800 text-sm font-semibold font-text leading-5">
        {row.description}
      </span>
    ),
  },
  {
    key: "amount",
    header: "amount",
    cell: (row) => (
      <span className="text-red-500 text-sm font-medium font-text leading-5">
        {row.amount}
      </span>
    ),
  },
  {
    key: "status",
    header: "status",
    cell: (row) => (
      <span className="px-2 py-0.5 bg-emerald-100 rounded-full text-emerald-500 text-xs font-medium font-text capitalize leading-4">
        {row.status}
      </span>
    ),
  },
];

const ExpensesRecordsTable = ({
  tableData,
}: {
  tableData: ExpensesRecordsRow[];
}) => {
  const data = tableData;

  const { rows, pagination } = useTableRows({
    tableId: "expensesRecords",
    data,
    rowsPerPage: 10,
    searchFields: ["vehicleName", "id", "description"],
    filters: [{ paramKey: "category", field: "category" }],
    sortField: "date",
  });

  return (
    <DataTable
      tableId="expensesRecords"
      columns={expensesRecordsRowColumns}
      rows={rows}
      pagination={pagination}
      emptyMessage="No expenses records found."
      toolbar={
        <TableToolbar
          search={{
            placeholder: "Search by vechile name, description, or ID...",
          }}
          filters={[
            {
              title: "All Category",
              paramKey: "category",
              items: [
                { label: "Fuel", value: "fuel" },
                { label: "Maintenance", value: "maintenance" },
                { label: "Insurance", value: "insurance" },
                { label: "Cleaning", value: "cleaning" },
                { label: "Registration", value: "registration" },
                { label: "Parking", value: "parking" },
                { label: "Marketing", value: "marketing" },
                { label: "Office", value: "office" },
                { label: "Other", value: "other" },
              ],
            },
          ]}
          dateSort
          actions={
            <button
              onClick={() =>
                exportToCSV(rows, {
                  filename: "ExpensesRecords",
                  columns: [
                    "id",
                    "date",
                    "vehicleName",
                    "category",
                    "description",
                    "amount",
                    "status",
                  ],
                })
              }
              className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer"
            >
              <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                Export CSV
              </span>
              <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
            </button>
          }
        />
      }
      viewAction={{
        type: "link",
        href: (row) => `${HOST_DASHBOARD_PATH}expenses/${row.id}`,
      }}
    />
  );
};

// ─── Invoices tab ─────────────────────────────────────────────────────────────

const InvoicesTab = ({ tableData }: { tableData: InvoiceRecordsRow[] }) => {
  return (
    <>
      <InvoiceRecordsTable tableData={tableData} />
    </>
  );
};

type InvoiceRecordsStatusType = "paid" | "pending" | "refunded" | "cancelled";

interface InvoiceRecordsRow {
  id: string;
  customer: string;
  vehicleName: string;
  period: string;
  days: string;
  amount: string;
  status: InvoiceRecordsStatusType;
}

const InvoiceRecordAmountStyle = ({
  status,
  amount,
}: {
  status: InvoiceRecordsStatusType;
  amount: string;
}) => {
  const styles: Record<string, string> = {
    paid: "text-green-500",
    pending: "text-amber-500",
    refunded: "text-gray-500",
    cancelled: "text-red-500",
  };

  return (
    <span
      className={`text-sm font-medium font-text leading-5 ${styles[status] ?? styles.refunded}`}
    >
      {amount}
    </span>
  );
};

const InvoiceRecordStatusBadge = ({
  status,
}: {
  status: InvoiceRecordsStatusType;
}) => {
  const styles: Record<string, string> = {
    paid: " bg-emerald-500/10 text-green-500",
    pending: "bg-amber-500/10 text-amber-500",
    refunded: "bg-gray-200 text-gray-500",
    cancelled: "bg-rose-500/10 text-red-500",
  };

  return (
    <span
      className={`flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium font-text leading-4 capitalize ${styles[status] ?? styles.refunded}`}
    >
      {status}
    </span>
  );
};

const invoiceRecordsRowColumns: ColumnDef<InvoiceRecordsRow>[] = [
  {
    key: "id",
    header: "Invoice",
    cell: (row) => (
      <span className="text-cyan-600 text-sm font-semibold font-text leading-5">
        {row.id}
      </span>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    cell: (row) => (
      <span className="text-gray-800 text-sm font-normal font-text leading-5">
        {row.customer}
      </span>
    ),
  },
  {
    key: "vehicleName",
    header: "Vehicle",
    cell: (row) => (
      <span className="text-gray-800 text-sm font-normal font-text leading-5">
        {row.vehicleName}
      </span>
    ),
  },
  {
    key: "period",
    header: "Period",
    cell: (row) => (
      <span className="text-gray-800 text-sm font-medium font-text leading-5">
        {row.period}
      </span>
    ),
  },
  {
    key: "days",
    header: "Days",
    cell: (row) => (
      <span className="text-gray-800 text-sm font-semibold font-text leading-5">
        {row.days}
      </span>
    ),
  },
  {
    key: "amount",
    header: "amount",
    cell: (row) => (
      <InvoiceRecordAmountStyle amount={row.amount} status={row.status} />
    ),
  },
  {
    key: "status",
    header: "status",
    cell: (row) => <InvoiceRecordStatusBadge status={row.status} />,
  },
];

const InvoiceRecordsTable = ({
  tableData,
}: {
  tableData: InvoiceRecordsRow[];
}) => {
  const data = tableData;

  const { rows, pagination } = useTableRows({
    tableId: "invoiceRecords",
    data,
    rowsPerPage: 10,
    searchFields: ["vehicleName", "id", "customer"],
    filters: [{ paramKey: "status", field: "status" }],
  });

  return (
    <DataTable
      tableId="invoiceRecords"
      columns={invoiceRecordsRowColumns}
      rows={rows}
      pagination={pagination}
      emptyMessage="No invoice records found."
      toolbar={
        <TableToolbar
          search={{ placeholder: "Search by vechile name, customer, or ID..." }}
          filters={[
            {
              title: "All Status",
              paramKey: "status",
              items: [
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
                { label: "Refunded", value: "refunded" },
                { label: "Cancelled", value: "cancelled" },
              ],
            },
          ]}
          actions={
            <button
              onClick={() =>
                exportToCSV(rows, {
                  filename: "InvoiceRecords",
                  columns: [
                    "id",
                    "customer",
                    "vehicleName",
                    "period",
                    "days",
                    "amount",
                    "status",
                  ],
                })
              }
              className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer"
            >
              <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                Export CSV
              </span>
              <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
            </button>
          }
        />
      }
      linkAction={{
        label: "Download PDF",
        href: (row) => `${HOST_DASHBOARD_PATH}expenses/${row.id}`,
        linkIcon: <Download className="size-3" />,
        mergeParams: false,
      }}
    />
  );
};

// ─── Toll records tab ─────────────────────────────────────────────────────────
type TollTabProps = {
  fetchVehicles: () => Promise<SelectOption[]>;
  fetchRentals: () => Promise<SelectOption[]>;
  onAddToll: (values: AddTollRecordFormValues) => void | Promise<void>;
  tableData: TollRecordsRow[];
};

const TollTab = ({
  fetchVehicles,
  fetchRentals,
  onAddToll,
  tableData,
}: TollTabProps) => {
  return (
    <div>
      <TabTitleSection
        title="Add a Toll Record"
        buttonLabel="Add Toll Records"
        formTitle="Add Toll Record"
        formDescription="Add a toll record for your fleet"
      >
        {(closePopup) => (
          <AddTollRecordForm
            fetchVehicles={fetchVehicles}
            fetchRentals={fetchRentals}
            onCancel={closePopup}
            onSubmit={async (values) => {
              await onAddToll(values);
              toast.success("Toll Record Added", {
                description: "Your profile and company details have been saved.",
              });
              closePopup();
            }}
          />
        )}
      </TabTitleSection>

      <TollRecordsTable tableData={tableData} />
    </div>
  );
};

interface TollRecordsRow {
  id: string;
  dateTime: string;
  vehicleName: string;
  route: string;
  tollLocation: string;
  charge: string;
  linkedRental: string;
}

const tollRecordsRowColumns: ColumnDef<TollRecordsRow>[] = [
  {
    key: "dateTime",
    header: "Date Time",
    cell: (row) => (
      <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
        {row.dateTime}
      </span>
    ),
  },
  {
    key: "vehicleName",
    header: "Vehicle",
    cell: (row) => (
      <span className="text-neutral-950 text-sm font-normal font-text leading-5">
        {row.vehicleName}
      </span>
    ),
  },
  {
    key: "route",
    header: "Route",
    cell: (row) => (
      <span className="text-emerald-500 text-sm font-medium font-text leading-5">
        {row.route}
      </span>
    ),
  },
  {
    key: "tollLocation",
    header: "Toll Location",
    cell: (row) => (
      <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
        {row.tollLocation}
      </span>
    ),
  },
  {
    key: "charge",
    header: "charge",
    cell: (row) => (
      <span className="text-red-500 text-sm font-normal font-text leading-5">
        {row.charge}
      </span>
    ),
  },
  {
    key: "linkedRental",
    header: "Linked Rental",
    cell: (row) => (
      <span className="text-cyan-500 text-sm font-normal font-text leading-5">
        {row.linkedRental}
      </span>
    ),
  },
];

const TollRecordsTable = ({ tableData }: { tableData: TollRecordsRow[] }) => {
  const data = tableData;

  const { rows, pagination } = useTableRows({
    tableId: "tollRecords",
    data,
    rowsPerPage: 10,
    searchFields: ["vehicleName", "id", "route"],
    sortField: "dateTime",
  });

  return (
    <DataTable
      tableId="tollRecords"
      columns={tollRecordsRowColumns}
      rows={rows}
      pagination={pagination}
      emptyMessage="No toll records found."
      toolbar={
        <TableToolbar
          search={{ placeholder: "Search by vechile name, route, or ID..." }}
          dateSort
          actions={
            <button
              onClick={() =>
                exportToCSV(rows, {
                  filename: "TollRecords",
                  columns: [
                    "id",
                    "dateTime",
                    "vehicleName",
                    "route",
                    "tollLocation",
                    "charge",
                    "linkedRental",
                  ],
                })
              }
              className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer"
            >
              <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                Export CSV
              </span>
              <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
            </button>
          }
        />
      }
    />
  );
};
