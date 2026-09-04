import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import { analyticsApi } from "./analyticsApi";
import { hostApi } from "./hostApi";

type AxiosBaseQueryArgs =
  | string
  | {
    url: string;
    method?: Method;
    body?: unknown;
    data?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
  };

type AxiosBaseQueryError = {
  status?: number;
  data: unknown;
};

const axiosBaseQuery = (): BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> => {
  return async (args) => {
    const request =
      typeof args === "string"
        ? { url: args, method: "GET" as Method }
        : {
          url: args.url,
          method: args.method ?? "GET",
          data: args.data ?? args.body,
          params: args.params,
        };

    try {
      const result = await apiClient({
        url: request.url,
        method: request.method,
        data: request.data,
        params: request.params,
      });
      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? axiosError.message,
        },
      };
    }
  };
};

type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "cancelled"
  | "completed";

export type BookingResponse = {
  id: string;
  referenceCode: string;
  paymentIntentId?: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  vehicleId: string;
  vehicleName: string;
  vehicleDetails: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  pickupTime?: string;
  returnTime?: string;
  addOns: Array<{ id: string; name: string; pricePerDay: number }>;
  baseRate: number;
  addOnsTotal: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  totalAmount: number;
  status: BookingStatus;
  displayStatus?:
  | "Upcoming"
  | "Running Late"
  | "Overdue"
  | "Active"
  | "Completed"
  | "Cancelled";
  vehicleImage?: string;
  payment?: {
    status: "paid" | "pending" | "failed" | "refunded" | "partially_refunded";
    currency: string;
    amountPaid: number;
    paymentDate?: string;
    platformCommission: number;
    netToHost: number;
    refundedAmount: number;
    refundDate?: string;
    paymentMethod?: string;
    cardBrand?: string;
    cardLast4?: string;
    receiptPdfUrl?: string;
  };
  timeline?: Array<{
    type: string;
    label: string;
    occurredAt: string;
  }>;
  checkOut?: {
    completedAt: string;
    completedBy: "host" | "renter";
    returnConfirmation: {
      renterReturned: boolean;
      keysReturned: boolean;
    };
    vehicleInspection: {
      mileage: number;
      fuelLevel: string;
      photoUrls: string[];
      damageStatus: "none" | "damage";
      damageType?: string;
      damageDescription?: string;
      damageAcknowledged?: boolean;
      damageAcknowledgedAt?: string;
    };
    renterRating?: {
      categoryRatings: Record<string, number>;
      notes?: string;
    };
    averageRenterRating?: number;
    issueReportId?: string;
  };
  incidentCharges?: Array<{
    id: string;
    incidentType: string;
    amount: number;
    description: string;
    evidenceUrls: string[];
    status: "pending" | "paid" | "waived";
    createdAt: string;
  }>;
  checkIn?: {
    id?: string;
    bookingId?: string;
    checkInTime?: string;
    driverLicenseNumber?: string;
    driverLicenseExpiry?: string;
    driverLicensePhotoUrl?: string;
    selfiePhotoUrl?: string;
    driverName?: string;
    additionalDrivers?: string[];
    fuelLevel?: number;
    odometerReading?: number;
    vehicleCondition?: {
      exterior?: string[];
      interior?: string[];
      damages?: string[];
    };
    paymentMethod?: "card" | "cash" | "bank_transfer";
    securityDeposit?: number;
    notes?: string;
    createdAt?: string;
  };
  checkInCompletion?: {
    completedAt?: string;
    checklist?: {
      identityVerified?: boolean;
      insuranceConfirmed?: boolean;
      vehicleInspected?: boolean;
      agreementSigned?: boolean;
      keysHandedOver?: boolean;
    };
    totalAmount?: number;
  };
  createdAt: string;
  updatedAt: string;
  make?: string;
  vehicle?: {
    model?: string;
    name?: string;
    licensePlate?: string;
    plateNumber?: string;
    registrationNumber?: string;
    photos?: Array<{ url?: string }>;
    image?: string;
    thumbnail?: string;
  };
  renter?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    name?: string;
    phone?: string;
    phoneNumber?: string;
    email?: string;
  };
  startDate?: string;
  endDate?: string;
  totalPrice?: number;
  pricing?: {
    total?: number;
  };
  trip?: {
    startDate?: string;
    PickUpDateTime?: string;
    endDate?: string;
    ReturnDateTime?: string;
  };
  insurance?: {
    policyNumber?: string;
    dailyRate?: number;
    provider?: string;
  };
  insurancePolicyNumber?: string;
};

type BookingEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type AllBookingsRow = {
  id: string;
  vehicle: string;
  renter: string;
  pickupDate: string;
  returnDate: string;
  duration: string;
  amount: string;
  status: "active" | "reserved" | "confirmed" | "completed" | "noShow" | "lateReturn";
};

type UpcomingRow = {
  id: string;
  vehicle: string;
  renter: string;
  returnDate: string;
  returnStatus: "dueToday" | "dueTomorrow" | "overdue" | "notSoon";
  amount: string;
};

type LateReturnRow = {
  id: string;
  vehicle: string;
  renter: string;
  returnDate: string;
  returnStatus: "lateReturn";
  renterPhoneNumber: string;
};

type DamageRow = {
  id: string;
  vehicle: string;
  damageType: string;
  renter: string;
  reportedDate: string;
  status: "damageReported";
};

type ListBookingsResponse = {
  success: boolean;
  data: BookingResponse[];
  count: number;
  allBookingsRows: AllBookingsRow[];
  upcomingRows: UpcomingRow[];
  lateReturnRows: LateReturnRow[];
  damageRows: DamageRow[];
};

type CreateBookingPayload = {
  vehicleId: string;
  paymentIntentId: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  pickupTime: string;
  returnTime: string;
  addOns?: string[];
  insuranceProvider?: string;
  policyNumber?: string;
  insuranceExpiry?: string;
};

type CreateBookingPaymentIntentPayload = {
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  currency?: string;
  metadata?: Record<string, string>;
};

type CreateBookingPaymentIntentResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    amount: number;
    currency: string;
    clientSecret: string;
    status: string;
    subtotal: number;
    tax: number;
    taxRate: number;
    totalAmount: number;
    metadata?: Record<string, string>;
  };
};

type StartCheckInPayload = {
  bookingId: string;
  driverLicenseNumber?: string;
  driverLicenseExpiry?: string;
  driverName: string;
  additionalDrivers?: string[];
  fuelLevel: number;
  odometerReading: number;
  vehicleCondition: {
    exterior: string[];
    interior: string[];
    damages: string[];
  };
  paymentMethod?: "card" | "cash" | "bank_transfer";
  securityDeposit?: number;
  notes?: string;
};

type CompleteCheckInPayload = {
  bookingId: string;
  body: {
    identityVerification: {
      idType: string;
      idDocumentUrl: string;
      identityMatched: boolean;
    };
    insuranceConfirmation: {
      insuranceSelected?: string;
      policyNumber?: string;
      coverageAmount?: number;
      deductible?: number;
      dailyRate?: number;
      confirmed: boolean;
    };
    vehicleInspection: {
      photoUrls: string[];
      currentMileageKm: number;
      fuelLevel: "empty" | "quarter" | "half" | "three_quarter" | "full";
      inspectionNotes?: string;
      confirmed: boolean;
    };
    agreementClosure: {
      agreedToTerms: boolean;
    };
    keysHandover: {
      keysHandedOver: boolean;
    };
  };
};

type CompleteCheckOutPayload = {
  bookingId: string;
  body: {
    returnConfirmation: {
      renterReturned: boolean;
      keysReturned: boolean;
    };
    vehicleInspection: {
      mileage: number;
      fuelLevel: string;
      photoUrls: string[];
      damageStatus: "none" | "damage";
      damageType?: string;
      damageDescription?: string;
    };
    renterRating?: {
      categoryRatings: Record<string, number>;
      notes?: string;
    };
  };
};

type ChargeIncidentalsPayload = {
  bookingId: string;
  body: {
    incidents: Array<{
      incidentType: string;
      amount: number;
      description: string;
      evidenceUrls?: string[];
    }>;
  };
};

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Bookings"],
  endpoints: (builder) => ({
    listBookings: builder.query<ListBookingsResponse, void>({
      query: () => ({
        url: "/api/host/bookings",
        method: "GET",
      }),
      providesTags: [{ type: "Bookings", id: "LIST" }],
    }),

    getBookingById: builder.query<BookingEnvelope<BookingResponse>, string>({
      query: (bookingId) => ({
        url: `/api/host/bookings/${bookingId}`,
        method: "GET",
      }),
      providesTags: (result, error, bookingId) => [
        { type: "Bookings", id: bookingId },
      ],
    }),

    getBookingByReference: builder.query<
      BookingEnvelope<BookingResponse>,
      string
    >({
      query: (referenceCode) => ({
        url: `/api/host/bookings/reference/${referenceCode}`,
        method: "GET",
      }),
      providesTags: (result, error, referenceCode) => [
        { type: "Bookings", id: `REF-${referenceCode}` },
      ],
    }),

    createBooking: builder.mutation<
      BookingEnvelope<BookingResponse>,
      CreateBookingPayload
    >({
      query: (payload) => ({
        url: "/api/host/bookings",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Bookings", id: "LIST" }],
    }),

    createBookingPaymentIntent: builder.mutation<
      CreateBookingPaymentIntentResponse,
      CreateBookingPaymentIntentPayload
    >({
      query: (payload) => ({
        url: "/api/host/bookings/create-payment-intent",
        method: "POST",
        body: payload,
      }),
    }),

    cancelBooking: builder.mutation<BookingEnvelope<BookingResponse>, string>({
      query: (bookingId) => ({
        url: `/api/host/bookings/${bookingId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, bookingId) => [
        { type: "Bookings", id: bookingId },
        { type: "Bookings", id: `REF-${bookingId}` },
        ...(result?.data?.id
          ? [{ type: "Bookings" as const, id: result.data.id }]
          : []),
        { type: "Bookings", id: "LIST" },
      ],
      async onQueryStarted(_bookingId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            analyticsApi.util.invalidateTags([
              { type: "Analytics", id: "KPIS" },
              { type: "Analytics", id: "BOOKING_STATUS" },
              { type: "Analytics", id: "REVENUE_TRENDS" },
              { type: "Analytics", id: "VEHICLE_PERFORMANCE" },
              { type: "Analytics", id: "DASHBOARD" },
            ]),
          );
        } catch {
          // The mutation error is handled by the calling UI.
        }
      },
    }),

    confirmBooking: builder.mutation<BookingEnvelope<BookingResponse>, string>({
      query: (bookingId) => ({
        url: `/api/host/bookings/${bookingId}/confirm`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, bookingId) => [
        { type: "Bookings", id: bookingId },
        { type: "Bookings", id: "LIST" },
      ],
    }),

    completeBooking: builder.mutation<BookingEnvelope<BookingResponse>, string>(
      {
        query: (bookingId) => ({
          url: `/api/host/bookings/${bookingId}/complete`,
          method: "PUT",
        }),
        invalidatesTags: (result, error, bookingId) => [
          { type: "Bookings", id: bookingId },
          { type: "Bookings", id: "LIST" },
        ],
      },
    ),

    startCheckIn: builder.mutation<
      BookingEnvelope<BookingResponse>,
      StartCheckInPayload
    >({
      query: (payload) => ({
        url: "/api/host/bookings/checkin",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result) => [
        { type: "Bookings", id: result?.data?.id ?? "LIST" },
        { type: "Bookings", id: "LIST" },
      ],
    }),

    completeCheckIn: builder.mutation<
      BookingEnvelope<BookingResponse>,
      CompleteCheckInPayload
    >({
      query: ({ bookingId, body }) => ({
        url: `/api/host/bookings/${bookingId}/checkin/complete`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Bookings", id: bookingId },
        { type: "Bookings", id: "LIST" },
      ],
    }),
    completeCheckOut: builder.mutation<
      BookingEnvelope<BookingResponse>,
      CompleteCheckOutPayload
    >({
      query: ({ bookingId, body }) => ({
        url: `/api/host/bookings/${bookingId}/checkout/complete`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, _error, { bookingId }) => [
        { type: "Bookings", id: bookingId },
        { type: "Bookings", id: `REF-${bookingId}` },
        ...(result?.data?.id
          ? [{ type: "Bookings" as const, id: result.data.id }]
          : []),
        { type: "Bookings", id: "LIST" },
      ],
      async onQueryStarted(_payload, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(hostApi.util.invalidateTags([{ type: "Fleet", id: "LIST" }]));
          dispatch(
            analyticsApi.util.invalidateTags([
              { type: "Analytics", id: "KPIS" },
              { type: "Analytics", id: "BOOKING_STATUS" },
              { type: "Analytics", id: "VEHICLE_PERFORMANCE" },
              { type: "Analytics", id: "DASHBOARD" },
            ]),
          );
        } catch {
          // The checkout page displays the mutation error.
        }
      },
    }),
    chargeIncidentals: builder.mutation<
      BookingEnvelope<BookingResponse>,
      ChargeIncidentalsPayload
    >({
      query: ({ bookingId, body }) => ({
        url: `/api/host/bookings/${bookingId}/incident-charges`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, _error, { bookingId }) => [
        { type: "Bookings", id: bookingId },
        { type: "Bookings", id: `REF-${bookingId}` },
        ...(result?.data?.id
          ? [{ type: "Bookings" as const, id: result.data.id }]
          : []),
        { type: "Bookings", id: "LIST" },
      ],
    }),
    acknowledgeDamageReport: builder.mutation<
      BookingEnvelope<BookingResponse>,
      string
    >({
      query: (bookingId) => ({
        url: `/api/host/bookings/${bookingId}/damage-report/acknowledge`,
        method: "PUT",
      }),
      invalidatesTags: (result, _error, bookingId) => [
        { type: "Bookings", id: bookingId },
        { type: "Bookings", id: `REF-${bookingId}` },
        ...(result?.data?.id
          ? [{ type: "Bookings" as const, id: result.data.id }]
          : []),
        { type: "Bookings", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListBookingsQuery,
  useLazyListBookingsQuery,
  useGetBookingByIdQuery,
  useLazyGetBookingByIdQuery,
  useGetBookingByReferenceQuery,
  useLazyGetBookingByReferenceQuery,
  useCreateBookingMutation,
  useCreateBookingPaymentIntentMutation,
  useCancelBookingMutation,
  useConfirmBookingMutation,
  useCompleteBookingMutation,
  useStartCheckInMutation,
  useCompleteCheckInMutation,
  useCompleteCheckOutMutation,
  useChargeIncidentalsMutation,
  useAcknowledgeDamageReportMutation,
} = bookingApi;
