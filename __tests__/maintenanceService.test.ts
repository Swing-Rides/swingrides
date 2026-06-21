import {
  logMaintenanceServiceFromModal,
} from "../services/maintenanceService";
import {LogServiceModalRequest} from "../interfaces/maintenance";

// Mock dependencies to isolate the function under test
jest.mock("../models/VehicleSchema", () => ({
  findOne: jest.fn(),
}));
jest.mock("mongoose", () => ({
  Types: {
    ObjectId: class MockObjectId {} as any,
  },
}));

describe("logMaintenanceServiceFromModal (Validation & Logic Test)", () => {
  const mockVehicle = {
    _id: new Promise((resolve) => resolve(new mongoose.Types.ObjectId())), // Simulate ObjectId
    name: "Test Vehicle",
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if serviceDate is missing", async () => {
    const payload: LogServiceModalRequest = {
      vehicle: "Test Vehicle",
      serviceType: "Oil Change",
      // serviceDate is missing
      mileageAtServiceKm: 10000,
      cost: 500,
      providerOrWorkshop: "AutoShop Inc.",
      notes: "",
      nextServiceDueMode: "date", // Should not matter if date is missing
      nextDueDate: "2025-12-31",
      nextDueMileageKm: 20000,
    };

    await expect(
      logMaintenanceServiceFromModal(payload),
    ).rejects.toThrow("Service Date is required.");
  });

  it("should throw an error if serviceDate is invalid (e.g., malformed string)", async () => {
    const payload: LogServiceModalRequest = {
      vehicle: "Test Vehicle",
      serviceType: "Oil Change",
      serviceDate: "Not a real date", // Invalid date format
      mileageAtServiceKm: 10000,
      cost: 500,
      providerOrWorkshop: "AutoShop Inc.",
      notes: "",
      nextServiceDueMode: "date",
      nextDueDate: "2025-12-31",
      nextDueMileageKm: 20000,
    };

    await expect(
      logMaintenanceServiceFromModal(payload),
    ).rejects.toThrow("Invalid Service Date provided.");
  });

  it("should throw an error if mode is 'date' but nextDueDate is missing", async () => {
    const payload: LogServiceModalRequest = {
      vehicle: "Test Vehicle",
      serviceType: "Oil Change",
      serviceDate: new Date().toISOString(), // Valid date
      mileageAtServiceKm: 10000,
      cost: 500,
      providerOrWorkshop: "AutoShop Inc.",
      notes: "",
      nextServiceDueMode: "date",
      // nextDueDate is missing
      nextDueDate: null as any, 
      nextDueMileageKm: 20000,
    };

    await expect(
      logMaintenanceServiceFromModal(payload),
    ).rejects.toThrow("Next Due Date is required when service due mode is 'date'.");
  });
  
  it("should successfully log with all valid fields (mode: date)", async () => {
    const payload: LogServiceModalRequest = {
      vehicle: "Test Vehicle",
      serviceType: "Full Service",
      serviceDate: new Date().toISOString(),
      mileageAtServiceKm: 10000,
      cost: 500,
      providerOrWorkshop: "AutoShop Inc.",
      notes: "",
      nextServiceDueMode: "date",
      nextDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Next year
      nextDueMileageKm: 25000,
    };

    // Mock vehicle findOne to pass the check
    require("../models/VehicleSchema").findOne.mockResolvedValue(mockVehicle);
    
    await expect(
      logMaintenanceServiceFromModal(payload),
    ).resolves.toBeDefined();
  });

  it("should successfully log with flexible date inputs (mode: mileage)", async () => {
    const payload: LogServiceModalRequest = {
      vehicle: "Test Vehicle",
      serviceType: "Tire Rotation",
      serviceDate: new Date().toISOString(),
      mileageAtServiceKm: 10000,
      cost: 150,
      providerOrWorkshop: "AutoShop Inc.",
      notes: "",
      nextServiceDueMode: "mileage", // Mileage based calculation
      nextDueDate: null as any,
      nextDueMileageKm: 12500,
    };

    require("../models/VehicleSchema").findOne.mockResolvedValue(mockVehicle);
    
    await expect(
      logMaintenanceServiceFromModal(payload),
    ).resolves.toBeDefined();
  });

  it("should successfully log with default next due date calculation (mode: undefined)", async () => {
    const payload: LogServiceModalRequest = {
      vehicle: "Test Vehicle",
      serviceType: "Oil Change",
      serviceDate: new Date().toISOString(),
      mileageAtServiceKm: 10000,
      cost: 300,
      providerOrWorkshop: "AutoShop Inc.",
      notes: "",
      nextServiceDueMode: undefined as any, // Fallback calculation
      nextDueDate: null as any,
      nextDueMileageKm: 0,
    };

    require("../models/VehicleSchema").findOne.mockResolvedValue(mockVehicle);
    
    await expect(
      logMaintenanceServiceFromModal(payload),
    ).resolves.toBeDefined();
  });
});