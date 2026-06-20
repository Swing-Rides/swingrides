'use client'

import { ReactNode, Suspense, useCallback, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageWrapper from '../../dashboard/pageWrapper'
import { Download, X } from 'lucide-react'
import AddExpenseForm, { AddExpenseFormValues } from '../../forms/addExpenseForm'
import { SelectOption } from '@/components/forms/types'
import AddTollRecordForm, { AddTollRecordFormValues } from '../../forms/addTollRecordForm'
import { ColumnDef, DataTable, exportToCSV, TableToolbar, useTableRows } from '../../dashboard/customTable'
import { HOST_DASHBOARD_PATH } from '@/constants/constant'
import { ExpenseBarSegment } from '../../dashboard/dynamicImport'
import { ExpensesBarSegmentDataType } from '../../charts/expensesBarSegment'


const MOCK_TOLL_RECORDS: TollRecordsRow[] = [
        { id: "TR-001", dateTime: "2026-06-19T08:15:00Z", vehicleName: "Tesla Model 3", route: "I-95 North", tollLocation: "Hudson River Crossing", charge: "$15.00", linkedRental: "BK-1001" },
        { id: "TR-002", dateTime: "2026-06-19T09:30:00Z", vehicleName: "BMW X5", route: "Route 101", tollLocation: "Golden Gate Bridge", charge: "$9.50", linkedRental: "BK-2001" },
        { id: "TR-003", dateTime: "2026-06-19T10:45:00Z", vehicleName: "Toyota RAV4", route: "I-90 East", tollLocation: "Chicago Skyway", charge: "$6.25", linkedRental: "BK-5001" },
        { id: "TR-004", dateTime: "2026-06-18T16:20:00Z", vehicleName: "Ford F-150", route: "Turnpike", tollLocation: "New Jersey Exit 14", charge: "$4.00", linkedRental: "BK-3001" },
        { id: "TR-005", dateTime: "2026-06-18T18:10:00Z", vehicleName: "Honda Accord", route: "I-495", tollLocation: "Capital Beltway Express", charge: "$12.75", linkedRental: "BK-6001" },
        { id: "TR-006", dateTime: "2026-06-17T14:50:00Z", vehicleName: "Audi A4", route: "I-10 West", tollLocation: "Bay Bridge", charge: "$7.00", linkedRental: "BK-7001" },
        { id: "TR-007", dateTime: "2026-06-17T19:05:00Z", vehicleName: "Porsche 911", route: "SR-73", tollLocation: "San Joaquin Hills", charge: "$10.50", linkedRental: "BK-1501" }
];

const MOCK_INVOICE_RECORDS: InvoiceRecordsRow[] = [
        { id: "INV-001", customer: "Alexander Pierce", vehicleName: "Tesla Model 3", period: "June 2026", days: "3", amount: "$450.00", status: "paid" },
        { id: "INV-002", customer: "Sarah Jenkins", vehicleName: "Ford F-150", period: "May 2026", days: "2", amount: "$320.00", status: "paid" },
        { id: "INV-003", customer: "Michael Chen", vehicleName: "Porsche 911", period: "June 2026", days: "2", amount: "$1,200.00", status: "pending" },
        { id: "INV-004", customer: "David Smith", vehicleName: "Toyota RAV4", period: "May 2026", days: "3", amount: "$240.00", status: "paid" },
        { id: "INV-005", customer: "Jordan Taylor", vehicleName: "Honda Civic", period: "June 2026", days: "2", amount: "$180.00", status: "pending" },
        { id: "INV-006", customer: "Samantha Reed", vehicleName: "Subaru Outback", period: "May 2026", days: "2", amount: "$310.00", status: "refunded" },
        { id: "INV-007", customer: "Olivia Martinez", vehicleName: "Mini Cooper", period: "June 2026", days: "1", amount: "$110.00", status: "paid" },
        { id: "INV-008", customer: "James Bond", vehicleName: "Aston Martin DB5", period: "May 2026", days: "3", amount: "$5,000.00", status: "paid" },
        { id: "INV-009", customer: "Isabella Garcia", vehicleName: "Audi A4", period: "June 2026", days: "3", amount: "$420.00", status: "cancelled" }
];

const MOCK_EXPENSE_RECORDS: ExpensesRecordsRow[] = [
        { id: "EXP-001", date: "2026-06-01", vehicleName: "Tesla Model 3", category: "fuel", description: "Supercharger session", amount: "$15.50", status: "logged" },
        { id: "EXP-002", date: "2026-06-02", vehicleName: "BMW X5", category: "maintenance", description: "Oil change service", amount: "$150.00", status: "logged" },
        { id: "EXP-003", date: "2026-06-03", vehicleName: "General", category: "office", description: "Printer ink and paper", amount: "$45.00", status: "logged" },
        { id: "EXP-004", date: "2026-06-04", vehicleName: "Toyota RAV4", category: "cleaning", description: "Full interior detail", amount: "$85.00", status: "logged" },
        { id: "EXP-005", date: "2026-06-05", vehicleName: "Porsche 911", category: "insurance", description: "Monthly premium installment", amount: "$400.00", status: "logged" },
        { id: "EXP-006", date: "2026-06-06", vehicleName: "Ford F-150", category: "registration", description: "Annual state tag renewal", amount: "$120.00", status: "logged" },
        { id: "EXP-007", date: "2026-06-07", vehicleName: "Audi A4", category: "parking", description: "Downtown garage parking", amount: "$25.00", status: "logged" },
        { id: "EXP-008", date: "2026-06-08", vehicleName: "General", category: "marketing", description: "Social media ad campaign", amount: "$250.00", status: "logged" },
        { id: "EXP-009", date: "2026-06-09", vehicleName: "Nissan Rogue", category: "fuel", description: "Gas station fill-up", amount: "$60.00", status: "logged" },
        { id: "EXP-010", date: "2026-06-10", vehicleName: "Tesla Model 3", category: "other", description: "Replacement key fob", amount: "$180.00", status: "logged" },
        { id: "EXP-011", date: "2026-06-10", vehicleName: "Mercedes E-Class", category: "maintenance", description: "Tire rotation", amount: "$70.00", status: "logged" },
        { id: "EXP-012", date: "2026-06-11", vehicleName: "Mazda Miata", category: "cleaning", description: "Car wash", amount: "$20.00", status: "logged" },
        { id: "EXP-013", date: "2026-06-11", vehicleName: "Jeep Wrangler", category: "fuel", description: "Gas station fill-up", amount: "$75.00", status: "logged" },
        { id: "EXP-014", date: "2026-06-12", vehicleName: "Subaru Outback", category: "maintenance", description: "Brake pad inspection", amount: "$50.00", status: "logged" },
        { id: "EXP-015", date: "2026-06-12", vehicleName: "Ford Mustang", category: "parking", description: "Airport short-term parking", amount: "$40.00", status: "logged" },
        { id: "EXP-016", date: "2026-06-13", vehicleName: "Tesla Model S", category: "fuel", description: "Charging station", amount: "$12.00", status: "logged" },
        { id: "EXP-017", date: "2026-06-13", vehicleName: "Mini Cooper", category: "insurance", description: "Annual policy fee", amount: "$800.00", status: "logged" },
        { id: "EXP-018", date: "2026-06-14", vehicleName: "Volkswagen Golf", category: "maintenance", description: "Wiper replacement", amount: "$35.00", status: "logged" },
        { id: "EXP-019", date: "2026-06-14", vehicleName: "Volvo XC90", category: "cleaning", description: "Exterior wash", amount: "$15.00", status: "logged" },
        { id: "EXP-020", date: "2026-06-15", vehicleName: "Range Rover", category: "fuel", description: "Premium gas fill-up", amount: "$95.00", status: "logged" },
        { id: "EXP-021", date: "2026-06-15", vehicleName: "Hyundai Elantra", category: "registration", description: "Duplicate title fee", amount: "$30.00", status: "logged" },
        { id: "EXP-022", date: "2026-06-16", vehicleName: "BMW M4", category: "parking", description: "Valet parking fee", amount: "$50.00", status: "logged" },
        { id: "EXP-023", date: "2026-06-16", vehicleName: "Kia Soul", category: "office", description: "Office snacks", amount: "$40.00", status: "logged" },
        { id: "EXP-024", date: "2026-06-17", vehicleName: "Subaru Impreza", category: "marketing", description: "Printing business cards", amount: "$60.00", status: "logged" },
        { id: "EXP-025", date: "2026-06-17", vehicleName: "Tesla Model 3", category: "maintenance", description: "Tire repair", amount: "$110.00", status: "logged" },
        { id: "EXP-026", date: "2026-06-18", vehicleName: "BMW X5", category: "fuel", description: "Gas station fill-up", amount: "$85.00", status: "logged" },
        { id: "EXP-027", date: "2026-06-18", vehicleName: "Audi A4", category: "other", description: "Towing service", amount: "$200.00", status: "logged" },
        { id: "EXP-028", date: "2026-06-18", vehicleName: "Toyota RAV4", category: "cleaning", description: "Full detail", amount: "$100.00", status: "logged" },
        { id: "EXP-029", date: "2026-06-19", vehicleName: "Honda Accord", category: "maintenance", description: "Battery jump start", amount: "$45.00", status: "logged" },
        { id: "EXP-030", date: "2026-06-19", vehicleName: "Ford F-150", category: "fuel", description: "Gas station fill-up", amount: "$90.00", status: "logged" },
        { id: "EXP-031", date: "2026-06-19", vehicleName: "Porsche 911", category: "parking", description: "Monthly reserved spot", amount: "$300.00", status: "logged" },
        { id: "EXP-032", date: "2026-06-20", vehicleName: "Nissan Rogue", category: "insurance", description: "Deductible payment", amount: "$500.00", status: "logged" },
        { id: "EXP-033", date: "2026-06-20", vehicleName: "Chevrolet Tahoe", category: "office", description: "Printer toner", amount: "$120.00", status: "logged" },
        { id: "EXP-034", date: "2026-06-20", vehicleName: "Mercedes E-Class", category: "cleaning", description: "Car wash and wax", amount: "$50.00", status: "logged" },
        { id: "EXP-035", date: "2026-06-20", vehicleName: "Mazda Miata", category: "maintenance", description: "Filter replacement", amount: "$55.00", status: "logged" },
        { id: "EXP-036", date: "2026-06-20", vehicleName: "Jeep Wrangler", category: "marketing", description: "Search engine ads", amount: "$150.00", status: "logged" },
        { id: "EXP-037", date: "2026-06-20", vehicleName: "Subaru Outback", category: "other", description: "Courier fee", amount: "$25.00", status: "logged" }
];

const MOCK_EXPENSES_BAR_DATA: ExpensesBarSegmentDataType[] = [
        { name: "fuel", value: 125075, color: "#F97316" },
        { name: "maintenance", value: 240050, color: "#EF4444" },
        { name: "insurance", value: 450000, color: "#0891B2" },
        { name: "cleaning", value: 85025, color: "#10B981" },
        { name: "registration", value: 60000, color: "#7C3AED" },
        { name: "parking", value: 45075, color: "#F59E0B" },
        { name: "marketing", value: 120000, color: "#EC4899" },
        { name: "office", value: 352850, color: "#6B7280" },
        { name: "other", value: 485000, color: "#000000" }
]

// ─── Vehicle options — stable async fetcher ───────────────────────────────────

type VehicleOption = { label: string; value: string }

export default function ExpensesPageComponents() {

        // Stable reference — required so MainForm's useMemo-wrapped use() promise
        // doesn't get recreated (and re-suspended) on every render
        const fetchVehicles = useCallback(async (): Promise<VehicleOption[]> => {
                // TODO: replace with real API call
                // const res = await fetch('/api/fleet/vehicles')
                // const data = await res.json()
                // return data.map((v) => ({ label: v.vehicleName, value: v.id }))
                return [
                        { label: 'Toyota Camry 2024', value: 'veh_001' },
                        { label: 'Tesla Model S', value: 'veh_002' },
                        { label: 'Honda CR-V Hybrid', value: 'veh_003' },
                ]
        }, [])

        const handleAddExpenseSubmit = useCallback(async (values: AddExpenseFormValues) => {
                // TODO: replace with real API call
                console.log('logging expense:', values)
        }, [])

        const fetchRentals = useCallback(async (): Promise<SelectOption[]> => {
                // TODO: replace with real API call
                // const res = await fetch('/api/rentals/active')
                // const data = await res.json()
                // return data.map((r) => ({ label: r.invoiceId, value: r.id }))
                return [
                        { label: 'INV-2026-0042', value: 'rental_001' },
                        { label: 'INV-2026-0039', value: 'rental_002' },
                        { label: 'INV-2026-0031', value: 'rental_003' },
                ]
        }, [])

        const handleAddTollSubmit = useCallback(async (values: AddTollRecordFormValues) => {
                // TODO: replace with real API call
                console.log('logging toll record:', values)
        }, [])

        return (
                <PageWrapper
                        pageTitle='Expenses & Invoices'
                        pageDescription='Track spending, manage invoices, and monitor toll charges across your fleet.'
                >
                        <div className='mt-4 md:mt-8 space-y-6'>
                                <div className='flex flex-wrap items-center gap-4'>
                                        <OverviewCard
                                                label='Total Revenue'
                                                number='$18,420,000'
                                                numberColor='text-emerald-500'
                                        />
                                        <OverviewCard
                                                label='Total Expenses'
                                                number='$5,840,000'
                                                numberColor='text-red-500'
                                        />
                                        <OverviewCard
                                                label='Net Profit'
                                                number='$12,580,000'
                                                numberColor='text-blue-500'
                                        />
                                        <OverviewCard
                                                label='Pending Invoices'
                                                number='$2,340,000'
                                                numberColor='text-amber-500'
                                        />
                                </div>
                                <Suspense>
                                        <ExpensesPageTabs
                                                fetchVehicles={fetchVehicles}
                                                fetchRentals={fetchRentals}
                                                onAddToll={handleAddTollSubmit}
                                                onAddExpense={handleAddExpenseSubmit}
                                                expensesBarSegmentData={MOCK_EXPENSES_BAR_DATA}
                                                expensesRecordsTableData={MOCK_EXPENSE_RECORDS}
                                                invoiceRecordsTableData={MOCK_INVOICE_RECORDS}
                                                tollRecordsTableData={MOCK_TOLL_RECORDS}
                                        />
                                </Suspense>
                        </div>
                </PageWrapper>
        )
}

// ─── Overview card ────────────────────────────────────────────────────────────

type OverviewCardProps = {
        label: string
        number: string
        numberColor: string
}

const OverviewCard = ({ label, number, numberColor }: OverviewCardProps) => {
        return (
                <div className='basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2 space-y-2'>
                        <div className='flex flex-col gap-2 justify-start items-start'>
                                <h4 className='text-gray-500 text-xs font-semibold font-text uppercase'>
                                        {label}
                                </h4>
                                <span className={`text-lg md:text-3xl font-medium font-text ${numberColor}`}>
                                        {number}
                                </span>
                        </div>
                </div>
        )
}

// ─── Tab nav config ───────────────────────────────────────────────────────────

const expensesTabTitle = [
        { value: 'expenses', title: 'Expenses' },
        { value: 'invoices', title: 'Invoices' },
        { value: 'tollRecords', title: 'Toll Records' },
]

type ExpensesPageTabsProps = {
        fetchVehicles: () => Promise<VehicleOption[]>;
        onAddExpense: (values: AddExpenseFormValues) => void | Promise<void>;
        expensesBarSegmentData: ExpensesBarSegmentDataType[];
        expensesRecordsTableData: ExpensesRecordsRow[];
        fetchRentals: () => Promise<SelectOption[]>;
        invoiceRecordsTableData: InvoiceRecordsRow[];
        onAddToll: (values: AddTollRecordFormValues) => void | Promise<void>;
        tollRecordsTableData: TollRecordsRow[];
}

const ExpensesPageTabs = ({ fetchVehicles, onAddExpense, expensesBarSegmentData, expensesRecordsTableData, fetchRentals, invoiceRecordsTableData, onAddToll, tollRecordsTableData }: ExpensesPageTabsProps ) => {

        const router = useRouter()
        const pathname = usePathname()
        const searchParams = useSearchParams()

        const activeTab = searchParams.get('tab') ?? 'expenses'

        const handleTabChange = (value: string) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('tab', value)
                router.push(`${pathname}?${params.toString()}`)
        }

        return (
                <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className='w-full space-y-4 md:space-y-6'
                >
                        <TabsList
                                variant='line'
                                className='gap-20 border-b-2'
                        >
                                {expensesTabTitle.map((item) => (
                                        <TabsTrigger
                                                key={item.value}
                                                value={item.value}
                                                className='flex gap-2 item-center justify-start data-[state=active]:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700 cursor-pointer'
                                        >
                                                {item.title}
                                        </TabsTrigger>
                                ))}
                        </TabsList>
                        <TabsContent value='expenses'>
                                <ExpensesTab
                                        fetchVehicles={fetchVehicles}
                                        onAddExpense={onAddExpense}
                                        expensesBarSegmentData={expensesBarSegmentData}
                                        tableData={expensesRecordsTableData}
                                />
                        </TabsContent>
                        <TabsContent value='invoices'>
                                <InvoicesTab 
                                        tableData={invoiceRecordsTableData}
                                />
                        </TabsContent>
                        <TabsContent value='tollRecords'>
                                <TollTab
                                        fetchRentals={fetchRentals}
                                        fetchVehicles={fetchVehicles}
                                        onAddToll={onAddToll}
                                        tableData={tollRecordsTableData}
                                />
                        </TabsContent>
                </Tabs>
        )
}

// ─── Reusable popup-with-form section ─────────────────────────────────────────

type TabTitleSectionProps = {
        title: string
        buttonLabel: string
        formTitle: string
        formDescription: string
        children: ReactNode | ((closePopup: () => void) => ReactNode)
}

const TabTitleSection = ({ title, buttonLabel, formTitle, formDescription, children }: TabTitleSectionProps) => {

        const [formPopup, setFormPopup] = useState(false)

        const handlePopupState = useCallback(() => setFormPopup(prev => !prev), [])
        const closePopup = useCallback(() => setFormPopup(false), [])

        return (
                <>
                        <div className='flex items-center justify-between'>
                                <h3 className='text-neutral-950 text-xl font-semibold font-text'>
                                        {title}
                                </h3>
                                <button
                                        className='px-6 py-2 bg-blue-700 rounded-xs text-center justify-center text-white text-sm font-semibold font-text capitalize cursor-pointer hover:bg-blue-900 duration-300 transition-colors'
                                        onClick={handlePopupState}
                                >
                                        {buttonLabel}
                                </button>
                        </div>

                        {formPopup && (
                                <div
                                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
                                        onClick={(e) => { if (e.target === e.currentTarget) closePopup() }}
                                >
                                        <div className='relative flex flex-col w-full max-w-lg max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden'>
                                                {/* Sticky header */}
                                                <div className='sticky top-0 z-10 bg-white border-b border-gray-200 px-5 pt-5 pb-4 flex flex-col gap-3'>
                                                        <div className='flex items-center justify-between'>
                                                                <div className='flex flex-col gap-2'>
                                                                        <h3 className='text-sm md:text-[20px] font-semibold font-text text-neutral-900'>
                                                                                {formTitle}
                                                                        </h3>
                                                                        {formDescription && (
                                                                                <span className='text-sm font-normal font-text text-gray-400 text-center block'>
                                                                                        {formDescription}
                                                                                </span>
                                                                        )}
                                                                </div>
                                                                <button
                                                                        onClick={closePopup}
                                                                        className='flex items-center justify-center size-7 rounded-full cursor-pointer hover:bg-gray-100 transition-colors'
                                                                        aria-label='Close'
                                                                >
                                                                        <X className='size-4 text-gray-500' />
                                                                </button>
                                                        </div>
                                                </div>
                                                <div className='flex-1 overflow-y-auto px-3 md:px-5 py-4 flex flex-col gap-4'>
                                                        {typeof children === 'function' ? children(closePopup) : children}
                                                </div>
                                        </div>
                                </div>
                        )}
                </>
        )
}

// ─── Expenses tab ─────────────────────────────────────────────────────────────

type ExpensesTabProps = {
        fetchVehicles: () => Promise<VehicleOption[]>;
        onAddExpense: (values: AddExpenseFormValues) => void | Promise<void>;
        expensesBarSegmentData: ExpensesBarSegmentDataType[];
        tableData: ExpensesRecordsRow[];
}

const ExpensesTab = ({ fetchVehicles, onAddExpense, expensesBarSegmentData, tableData }: ExpensesTabProps) => {
        return (
                <div className='space-y-4'>
                        <TabTitleSection
                                title='Add an expense'
                                buttonLabel='Add Expense'
                                formTitle='Add Expense'
                                formDescription='Log a new expense for your fleet'
                        >
                                {(closePopup) => (
                                        <AddExpenseForm
                                                fetchVehicles={fetchVehicles}
                                                onCancel={closePopup}
                                                onSubmit={async (values) => {
                                                        await onAddExpense(values)
                                                        closePopup()
                                                }}
                                        />
                                )}
                        </TabTitleSection>
                        <ExpenseBarSegment data={expensesBarSegmentData}/>
                        <ExpensesRecordsTable 
                                tableData={tableData}
                        />
                </div>
        )
}

type ExpensesRecordsCategoryType = "fuel" | "maintenance" | "insurance" | "cleaning" | 'registration' | 'parking' | 'marketing' | 'office' | 'other' 

interface ExpensesRecordsRow {
        id: string;
        date: string;
        vehicleName: string;
        category: ExpensesRecordsCategoryType;
        description: string;
        amount: string;
        status: 'logged';
}

const ExpensesRecordCategoryBadge = ({ category }: { category: ExpensesRecordsCategoryType }) => {

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
                <span className={`flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium font-text leading-4 capitalize ${styles[category] ?? styles.other}`}>
                        {category}
                </span>
        );
}

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
                cell: (row) => (
                        <ExpensesRecordCategoryBadge
                                category={row.category}
                        />
                ),
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
                        <span className='text-red-500 text-sm font-medium font-text leading-5'>
                                {row.amount}
                        </span>
                ),
        },
        {
                key: "status",
                header: "status",
                cell: (row) => (
                        <span className='px-2 py-0.5 bg-emerald-100 rounded-full text-emerald-500 text-xs font-medium font-text capitalize leading-4'>
                                {row.status}
                        </span>
                ),
        },
];

const ExpensesRecordsTable = ({ tableData }: { tableData: ExpensesRecordsRow[] }) => {

        const data = tableData

        const { rows, pagination } = useTableRows({
                tableId: "expensesRecords",
                data,
                rowsPerPage: 10,
                searchFields: ["vehicleName", "id", "description"],
                filters: [
                        { paramKey: "category", field: "category" },
                ],
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
                                        search={{ placeholder: "Search by vechile name, description, or ID..." }}
                                        filters={[
                                                {
                                                        title: "All Category",
                                                        paramKey: "category",
                                                        items: [
                                                                { label: 'Fuel', value: 'fuel' },
                                                                { label: 'Maintenance', value: 'maintenance' },
                                                                { label: 'Insurance', value: 'insurance' },
                                                                { label: 'Cleaning', value: 'cleaning' },
                                                                { label: 'Registration', value: 'registration' },
                                                                { label: 'Parking', value: 'parking' },
                                                                { label: 'Marketing', value: 'marketing' },
                                                                { label: 'Office', value: 'office' },
                                                                { label: 'Other', value: 'other' },
                                                        ],
                                                },
                                        ]}
                                        dateSort
                                        actions={
                                                <button
                                                        onClick={() =>
                                                                exportToCSV(rows, {
                                                                        filename: "ExpensesRecords",
                                                                        columns: ["id", "date", "vehicleName", "category", "description", "amount", "status"],
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
        )
}


// ─── Invoices tab ─────────────────────────────────────────────────────────────

const InvoicesTab = ({ tableData }: { tableData: InvoiceRecordsRow[] } ) => {
        return (
                <>
                        <InvoiceRecordsTable 
                                tableData={tableData}
                        />
                </>
        )
}

type InvoiceRecordsStatusType = "paid" | "pending" | "refunded" | "cancelled"

interface InvoiceRecordsRow {
        id: string;
        customer: string;
        vehicleName: string;
        period: string;
        days: string;
        amount: string;
        status: InvoiceRecordsStatusType;
}

const InvoiceRecordAmountStyle = ({ status, amount }: { status: InvoiceRecordsStatusType; amount: string }) => {

        const styles: Record<string, string> = {
                paid: "text-green-500",
                pending: "text-amber-500",
                refunded: "text-gray-500",
                cancelled: "text-red-500",
        };

        return (
                <span className={`text-sm font-medium font-text leading-5 ${styles[status] ?? styles.refunded}`}>
                        {amount}
                </span>
        )
}

const InvoiceRecordStatusBadge = ({ status }: { status: InvoiceRecordsStatusType }) => {

        const styles: Record<string, string> = {
                paid: " bg-emerald-500/10 text-green-500",
                pending: "bg-amber-500/10 text-amber-500",
                refunded: "bg-gray-200 text-gray-500",
                cancelled: "bg-rose-500/10 text-red-500",
        };

        return (
                <span className={`flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium font-text leading-4 capitalize ${styles[status] ?? styles.refunded}`}>
                        {status}
                </span>
        );
}

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
                        <InvoiceRecordAmountStyle 
                                amount={row.amount}
                                status={row.status}
                        />
                ),
        },
        {
                key: "status",
                header: "status",
                cell: (row) => (
                        <InvoiceRecordStatusBadge 
                                status={row.status}
                        />
                ),
        },
];

const InvoiceRecordsTable = ({ tableData }: { tableData: InvoiceRecordsRow[] }) => {

        const data = tableData

        const { rows, pagination } = useTableRows({
                tableId: "invoiceRecords",
                data,
                rowsPerPage: 10,
                searchFields: ["vehicleName", "id", "customer"],
                filters: [
                        { paramKey: "status", field: "status" },
                ],
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
                                                                        columns: ["id", "customer", "vehicleName", "period", "days", "amount", "status"],
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
                                linkIcon: <Download className='size-3' />,
                                mergeParams: false
                        }}
                />
        )
}

// ─── Toll records tab ─────────────────────────────────────────────────────────
type TollTabProps = {
        fetchVehicles: () => Promise<SelectOption[]>;
        fetchRentals: () => Promise<SelectOption[]>;
        onAddToll: (values: AddTollRecordFormValues) => void | Promise<void>;
        tableData: TollRecordsRow[];
}

const TollTab = ({ fetchVehicles, fetchRentals, onAddToll, tableData }: TollTabProps) => {
        return (
                <div>
                        <TabTitleSection
                                title='Add a Toll Record'
                                buttonLabel='Add Toll Records'
                                formTitle='Add Toll Record'
                                formDescription='Add a toll record for your fleet'
                        >
                                {(closePopup) => (
                                        <AddTollRecordForm
                                                fetchVehicles={fetchVehicles}
                                                fetchRentals={fetchRentals}
                                                onCancel={closePopup}
                                                onSubmit={async (values) => {
                                                        await onAddToll(values)
                                                        closePopup()
                                                }}
                                        />
                                )}
                        </TabTitleSection>

                        <TollRecordsTable tableData={tableData} />
                </div>
        )
}

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

        const data = tableData
                
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
                                                                        columns: ["id", "dateTime", "vehicleName", "route", "tollLocation", "charge", "linkedRental"],
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
                        
                        
        )
}