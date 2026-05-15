export type RenterStatus = "verified" | "pending" | "rejected";

export type BookingStatus = "upcoming" | "active" | "completed" | "cancelled";

export interface Booking {
        id: string;
        vehicleInformation: {
                vehicleName: string;
        };
        pickupDateAndTime: string;
        returnDateAndTime: string;
        totalCost: string;
        status: BookingStatus;
}

export interface Verification {
        dateSubmitted: string;
        documentType: string;
}

export interface RenterType {
        id: string;
        fullname: string;
        phoneNumber: string;
        licenseNumber?: string; 
        email: string;
        status: RenterStatus;
        totalSpent: number;
        totalBookings: number;
        dateJoined: string;
        slug: string;
        location: string;
        lastActive: string;
        dateOfBirth: string;
        address: string;
        verification: Verification;
        booking: Booking[];
        document?: {
                imageUrl: string;
                type: string;
                submittedDate: string;
        }
}

export const renterTestData: RenterType[] = [
        {
                id: "RT-001",
                fullname: "Alexander Pierce",
                phoneNumber: "+1-555-010-1234",
                licenseNumber: "DL-9928341",
                email: "a.pierce@example.com",
                status: "verified",
                totalSpent: 2250.00,
                totalBookings: 5,
                dateJoined: "2023-01-15T10:00:00Z",
                slug: "alexander-pierce",
                location: "New York, NY",
                lastActive: "2026-05-10T14:30:00Z",
                dateOfBirth: "1988-06-22",
                address: "742 Evergreen Terrace, New York, NY 10001",
                verification: { dateSubmitted: "2023-01-15T09:00:00Z", documentType: "Driver's License" },
                booking: [
                        { id: "BK-1001", vehicleInformation: { vehicleName: "Tesla Model 3" }, pickupDateAndTime: "2026-06-15T09:00:00Z", returnDateAndTime: "2026-06-18T18:00:00Z", totalCost: "450.00", status: "upcoming" },
                        { id: "BK-1002", vehicleInformation: { vehicleName: "BMW X5" }, pickupDateAndTime: "2026-04-10T10:00:00Z", returnDateAndTime: "2026-04-12T10:00:00Z", totalCost: "380.00", status: "completed" },
                        { id: "BK-1003", vehicleInformation: { vehicleName: "Audi A4" }, pickupDateAndTime: "2026-03-01T08:00:00Z", returnDateAndTime: "2026-03-05T12:00:00Z", totalCost: "520.00", status: "completed" },
                        { id: "BK-1004", vehicleInformation: { vehicleName: "Tesla Model 3" }, pickupDateAndTime: "2026-02-14T09:00:00Z", returnDateAndTime: "2026-02-16T09:00:00Z", totalCost: "300.00", status: "cancelled" },
                        { id: "BK-1005", vehicleInformation: { vehicleName: "Honda Accord" }, pickupDateAndTime: "2026-01-20T14:00:00Z", returnDateAndTime: "2026-01-25T14:00:00Z", totalCost: "600.00", status: "completed" }
                ]
        },
        {
                id: "RT-002",
                fullname: "Sarah Jenkins",
                phoneNumber: "+1-555-022-9876",
                licenseNumber: "DL-1122334",
                email: "sarah.j@webmail.com",
                status: "pending",
                totalSpent: 1450.00,
                totalBookings: 5,
                dateJoined: "2026-05-11T08:15:00Z",
                slug: "sarah-jenkins",
                location: "Chicago, IL",
                lastActive: "2026-05-11T08:30:00Z",
                dateOfBirth: "1995-11-03",
                address: "123 Windy City Ln, Chicago, IL 60601",
                verification: { dateSubmitted: "2026-05-11T08:20:00Z", documentType: "Passport" },
                booking: [
                        { id: "BK-2001", vehicleInformation: { vehicleName: "Ford F-150" }, pickupDateAndTime: "2026-05-20T10:00:00Z", returnDateAndTime: "2026-05-22T10:00:00Z", totalCost: "320.00", status: "upcoming" },
                        { id: "BK-2002", vehicleInformation: { vehicleName: "Toyota RAV4" }, pickupDateAndTime: "2026-04-15T09:00:00Z", returnDateAndTime: "2026-04-18T17:00:00Z", totalCost: "280.00", status: "completed" },
                        { id: "BK-2003", vehicleInformation: { vehicleName: "Ford F-150" }, pickupDateAndTime: "2026-03-10T08:00:00Z", returnDateAndTime: "2026-03-12T08:00:00Z", totalCost: "300.00", status: "completed" },
                        { id: "BK-2004", vehicleInformation: { vehicleName: "Chevrolet Tahoe" }, pickupDateAndTime: "2026-02-05T12:00:00Z", returnDateAndTime: "2026-02-07T12:00:00Z", totalCost: "400.00", status: "completed" },
                        { id: "BK-2005", vehicleInformation: { vehicleName: "Nissan Rogue" }, pickupDateAndTime: "2026-01-12T10:00:00Z", returnDateAndTime: "2026-01-13T10:00:00Z", totalCost: "150.00", status: "cancelled" }
                ],
                document: {
                        imageUrl: '/images/preview.svg',
                        type: `Driver's License`,
                        submittedDate: '24th April, 2025',
                }
        },
        {
                id: "RT-003",
                fullname: "Michael Chen",
                phoneNumber: "+1-555-033-4455",
                licenseNumber: "DL-4455667",
                email: "m.chen@techcorp.io",
                status: "verified",
                totalSpent: 4800.00,
                totalBookings: 5,
                dateJoined: "2022-03-10T12:00:00Z",
                slug: "michael-chen",
                location: "San Francisco, CA",
                lastActive: "2026-05-09T22:15:00Z",
                dateOfBirth: "1990-04-12",
                address: "456 Silicon Valley Blvd, Palo Alto, CA 94301",
                verification: { dateSubmitted: "2022-03-10T11:00:00Z", documentType: "Driver's License" },
                booking: [
                        { id: "BK-3001", vehicleInformation: { vehicleName: "Porsche 911" }, pickupDateAndTime: "2026-06-01T14:00:00Z", returnDateAndTime: "2026-06-03T14:00:00Z", totalCost: "1200.00", status: "upcoming" },
                        { id: "BK-3002", vehicleInformation: { vehicleName: "Tesla Model S" }, pickupDateAndTime: "2026-05-11T09:00:00Z", returnDateAndTime: "2026-05-14T09:00:00Z", totalCost: "900.00", status: "active" },
                        { id: "BK-3003", vehicleInformation: { vehicleName: "Range Rover" }, pickupDateAndTime: "2026-04-10T10:00:00Z", returnDateAndTime: "2026-04-15T10:00:00Z", totalCost: "1500.00", status: "completed" },
                        { id: "BK-3004", vehicleInformation: { vehicleName: "Mercedes E-Class" }, pickupDateAndTime: "2026-03-05T08:00:00Z", returnDateAndTime: "2026-03-07T08:00:00Z", totalCost: "700.00", status: "completed" },
                        { id: "BK-3005", vehicleInformation: { vehicleName: "BMW M3" }, pickupDateAndTime: "2026-02-20T13:00:00Z", returnDateAndTime: "2026-02-22T13:00:00Z", totalCost: "500.00", status: "cancelled" }
                ]
        },
        {
                id: "RT-004",
                fullname: "Elena Rodriguez",
                phoneNumber: "+1-555-044-7788",
                email: "elena.rod@provider.net",
                status: "rejected",
                totalSpent: 1200.00,
                totalBookings: 5,
                dateJoined: "2026-04-20T16:45:00Z",
                slug: "elena-rodriguez",
                location: "Miami, FL",
                lastActive: "2026-04-21T09:00:00Z",
                dateOfBirth: "1985-08-30",
                address: "890 Ocean Drive, Miami Beach, FL 33139",
                verification: { dateSubmitted: "2026-04-20T17:00:00Z", documentType: "Driver's License" },
                booking: [
                        { id: "BK-4001", vehicleInformation: { vehicleName: "Jeep Wrangler" }, pickupDateAndTime: "2026-04-25T08:00:00Z", returnDateAndTime: "2026-04-30T20:00:00Z", totalCost: "550.00", status: "cancelled" },
                        { id: "BK-4002", vehicleInformation: { vehicleName: "Mazda Miata" }, pickupDateAndTime: "2026-03-12T09:00:00Z", returnDateAndTime: "2026-03-14T09:00:00Z", totalCost: "250.00", status: "completed" },
                        { id: "BK-4003", vehicleInformation: { vehicleName: "Ford Mustang" }, pickupDateAndTime: "2026-02-10T10:00:00Z", returnDateAndTime: "2026-02-12T10:00:00Z", totalCost: "300.00", status: "completed" },
                        { id: "BK-4004", vehicleInformation: { vehicleName: "Chevrolet Camaro" }, pickupDateAndTime: "2026-01-05T11:00:00Z", returnDateAndTime: "2026-01-06T11:00:00Z", totalCost: "100.00", status: "completed" },
                        { id: "BK-4005", vehicleInformation: { vehicleName: "Fiat 500" }, pickupDateAndTime: "2025-12-20T08:00:00Z", returnDateAndTime: "2025-12-21T08:00:00Z", totalCost: "100.00", status: "completed" }
                ]
        },
        {
                id: "RT-005",
                fullname: "David Smith",
                phoneNumber: "+1-555-055-1122",
                licenseNumber: "DL-5544332",
                email: "dsmith82@email.com",
                status: "verified",
                totalSpent: 1120.00,
                totalBookings: 5,
                dateJoined: "2024-06-12T11:20:00Z",
                slug: "david-smith",
                location: "Austin, TX",
                lastActive: "2026-05-11T12:00:00Z",
                dateOfBirth: "1982-01-15",
                address: "202 Lone Star Way, Austin, TX 78701",
                verification: { dateSubmitted: "2024-06-12T12:00:00Z", documentType: "Driver's License" },
                booking: [
                        { id: "BK-5001", vehicleInformation: { vehicleName: "Toyota RAV4" }, pickupDateAndTime: "2026-05-12T09:00:00Z", returnDateAndTime: "2026-05-14T17:00:00Z", totalCost: "240.00", status: "upcoming" },
                        { id: "BK-5002", vehicleInformation: { vehicleName: "Honda Civic" }, pickupDateAndTime: "2026-04-01T10:00:00Z", returnDateAndTime: "2026-04-03T10:00:00Z", totalCost: "180.00", status: "completed" },
                        { id: "BK-5003", vehicleInformation: { vehicleName: "Subaru Crosstrek" }, pickupDateAndTime: "2026-03-15T08:00:00Z", returnDateAndTime: "2026-03-18T08:00:00Z", totalCost: "300.00", status: "completed" },
                        { id: "BK-5004", vehicleInformation: { vehicleName: "Toyota RAV4" }, pickupDateAndTime: "2026-02-10T12:00:00Z", returnDateAndTime: "2026-02-12T12:00:00Z", totalCost: "200.00", status: "completed" },
                        { id: "BK-5005", vehicleInformation: { vehicleName: "Hyundai Elantra" }, pickupDateAndTime: "2026-01-05T09:00:00Z", returnDateAndTime: "2026-01-07T09:00:00Z", totalCost: "200.00", status: "cancelled" }
                ]
        },
        {
                id: "RT-006",
                fullname: "Jordan Taylor",
                phoneNumber: "+1-555-066-3344",
                email: "j.taylor@freemail.com",
                status: "pending",
                totalSpent: 0,
                totalBookings: 0,
                dateJoined: "2026-05-10T15:30:00Z",
                slug: "jordan-taylor",
                location: "Seattle, WA",
                lastActive: "2026-05-11T07:45:00Z",
                dateOfBirth: "1998-03-25",
                address: "555 Emerald St, Seattle, WA 98101",
                verification: {
                        dateSubmitted: "2026-05-10T16:00:00Z",
                        documentType: "State ID"
                },
                booking: [
                        { id: "BK-6001", vehicleInformation: { vehicleName: "Honda Civic" }, pickupDateAndTime: "2026-05-25T10:00:00Z", returnDateAndTime: "2026-05-27T10:00:00Z", totalCost: "180.00", status: "upcoming" },
                        { id: "BK-6002", vehicleInformation: { vehicleName: "Kia Soul" }, pickupDateAndTime: "2026-04-10T09:00:00Z", returnDateAndTime: "2026-04-12T09:00:00Z", totalCost: "150.00", status: "active" },
                        { id: "BK-6003", vehicleInformation: { vehicleName: "Subaru Impreza" }, pickupDateAndTime: "2026-03-05T08:00:00Z", returnDateAndTime: "2026-03-08T08:00:00Z", totalCost: "220.00", status: "completed" },
                        { id: "BK-6004", vehicleInformation: { vehicleName: "Honda Civic" }, pickupDateAndTime: "2026-02-15T12:00:00Z", returnDateAndTime: "2026-02-17T12:00:00Z", totalCost: "180.00", status: "cancelled" },
                        { id: "BK-6005", vehicleInformation: { vehicleName: "Toyota Corolla" }, pickupDateAndTime: "2026-01-20T10:00:00Z", returnDateAndTime: "2026-01-22T10:00:00Z", totalCost: "170.00", status: "completed" }
                ],
                document: {
                        imageUrl: '/images/preview.svg',
                        type: `Driver's License`,
                        submittedDate: '24th April, 2025',
                }
        },
        {
                id: "RT-007",
                fullname: "Samantha Reed",
                phoneNumber: "+1-555-077-5566",
                licenseNumber: "DL-6655443",
                email: "sam.reed@design.co",
                status: "verified",
                totalSpent: 2100.75,
                totalBookings: 8,
                dateJoined: "2023-11-01T09:00:00Z",
                slug: "samantha-reed",
                location: "Denver, CO",
                lastActive: "2026-05-08T18:20:00Z",
                dateOfBirth: "1992-07-14",
                address: "101 Mountain View Dr, Denver, CO 80201",
                verification: {
                        dateSubmitted: "2023-11-01T10:00:00Z",
                        documentType: "Driver's License"
                },
                booking: [
                        { id: "BK-7001", vehicleInformation: { vehicleName: "Subaru Outback" }, pickupDateAndTime: "2026-05-11T08:00:00Z", returnDateAndTime: "2026-05-13T20:00:00Z", totalCost: "310.00", status: "active" },
                        { id: "BK-7002", vehicleInformation: { vehicleName: "Jeep Cherokee" }, pickupDateAndTime: "2026-04-15T09:00:00Z", returnDateAndTime: "2026-04-18T09:00:00Z", totalCost: "350.00", status: "completed" },
                        { id: "BK-7003", vehicleInformation: { vehicleName: "Toyota 4Runner" }, pickupDateAndTime: "2026-03-20T10:00:00Z", returnDateAndTime: "2026-03-23T10:00:00Z", totalCost: "400.00", status: "completed" },
                        { id: "BK-7004", vehicleInformation: { vehicleName: "Subaru Outback" }, pickupDateAndTime: "2026-02-10T12:00:00Z", returnDateAndTime: "2026-02-12T12:00:00Z", totalCost: "280.00", status: "completed" },
                        { id: "BK-7005", vehicleInformation: { vehicleName: "Volkswagen Tiguan" }, pickupDateAndTime: "2026-01-05T08:00:00Z", returnDateAndTime: "2026-01-08T08:00:00Z", totalCost: "310.00", status: "completed" }
                ]
        },
        {
                id: "RT-008",
                fullname: "Robert Wilson",
                phoneNumber: "+1-555-088-6677",
                licenseNumber: "DL-8877665",
                email: "rwilson@logistics.com",
                status: "verified",
                totalSpent: 450.00,
                totalBookings: 2,
                dateJoined: "2025-02-14T14:00:00Z",
                slug: "robert-wilson",
                location: "Atlanta, GA",
                lastActive: "2026-05-01T11:00:00Z",
                dateOfBirth: "1975-12-05",
                address: "303 Peachtree St, Atlanta, GA 30301",
                verification: {
                        dateSubmitted: "2025-02-14T15:00:00Z",
                        documentType: "Driver's License"
                },
                booking: [
                        { id: "BK-8001", vehicleInformation: { vehicleName: "Chevrolet Suburban" }, pickupDateAndTime: "2026-04-20T09:00:00Z", returnDateAndTime: "2026-04-22T09:00:00Z", totalCost: "400.00", status: "completed" },
                        { id: "BK-8002", vehicleInformation: { vehicleName: "GMC Yukon" }, pickupDateAndTime: "2026-03-10T10:00:00Z", returnDateAndTime: "2026-03-13T10:00:00Z", totalCost: "450.00", status: "completed" },
                        { id: "BK-8003", vehicleInformation: { vehicleName: "Ford Expedition" }, pickupDateAndTime: "2026-02-15T08:00:00Z", returnDateAndTime: "2026-02-17T08:00:00Z", totalCost: "400.00", status: "completed" },
                        { id: "BK-8004", vehicleInformation: { vehicleName: "Chevrolet Suburban" }, pickupDateAndTime: "2026-01-20T12:00:00Z", returnDateAndTime: "2026-01-22T12:00:00Z", totalCost: "350.00", status: "completed" },
                        { id: "BK-8005", vehicleInformation: { vehicleName: "Toyota Sienna" }, pickupDateAndTime: "2025-12-10T09:00:00Z", returnDateAndTime: "2025-12-12T09:00:00Z", totalCost: "250.00", status: "completed" }
                ]
        },
        {
                id: "RT-009",
                fullname: "Olivia Martinez",
                phoneNumber: "+1-555-099-8899",
                email: "omartinez@university.edu",
                status: "pending",
                totalSpent: 0,
                totalBookings: 0,
                dateJoined: "2026-05-11T13:45:00Z",
                slug: "olivia-martinez",
                location: "Boston, MA",
                lastActive: "2026-05-11T14:00:00Z",
                dateOfBirth: "2002-05-19",
                address: "15 Beacon St, Boston, MA 02108",
                verification: {
                        dateSubmitted: "2026-05-11T13:50:00Z",
                        documentType: "State ID"
                },
                booking: [
                        { id: "BK-1101", vehicleInformation: { vehicleName: "Mazda CX-5" }, pickupDateAndTime: "2026-04-10T10:00:00Z", returnDateAndTime: "2026-04-12T10:00:00Z", totalCost: "150.00", status: "completed" },
                        { id: "BK-1102", vehicleInformation: { vehicleName: "Subaru Forester" }, pickupDateAndTime: "2026-03-20T09:00:00Z", returnDateAndTime: "2026-03-22T09:00:00Z", totalCost: "150.00", status: "completed" },
                        { id: "BK-1103", vehicleInformation: { vehicleName: "Mazda CX-5" }, pickupDateAndTime: "2026-02-15T08:00:00Z", returnDateAndTime: "2026-02-17T08:00:00Z", totalCost: "150.00", status: "active" },
                        { id: "BK-1104", vehicleInformation: { vehicleName: "Toyota Prius" }, pickupDateAndTime: "2026-01-10T12:00:00Z", returnDateAndTime: "2026-01-12T12:00:00Z", totalCost: "150.00", status: "completed" },
                        { id: "BK-1105", vehicleInformation: { vehicleName: "Mazda CX-5" }, pickupDateAndTime: "2025-12-15T10:00:00Z", returnDateAndTime: "2025-12-17T10:00:00Z", totalCost: "150.00", status: "completed" }
                ],
                document: {
                        imageUrl: '/images/preview.svg',
                        type: `Driver's License`,
                        submittedDate: '24th April, 2025',
                }
        },
        {
                id: "RT-010",
                fullname: "William Wright",
                phoneNumber: "+1-555-101-2233",
                licenseNumber: "DL-1010202",
                email: "will.wright@gamemail.com",
                status: "verified",
                totalSpent: 150.00,
                totalBookings: 1,
                dateJoined: "2025-08-20T10:30:00Z",
                slug: "william-wright",
                location: "Portland, OR",
                lastActive: "2026-04-15T16:00:00Z",
                dateOfBirth: "1987-09-10",
                address: "999 Rose Garden Ln, Portland, OR 97201",
                verification: {
                        dateSubmitted: "2025-08-20T11:00:00Z",
                        documentType: "Driver's License"
                },
                booking: [
                        { id: "BK-1201", vehicleInformation: { vehicleName: "Volkswagen Golf" }, pickupDateAndTime: "2026-05-01T09:00:00Z", returnDateAndTime: "2026-05-03T18:00:00Z", totalCost: "220.00", status: "upcoming" },
                        { id: "BK-1202", vehicleInformation: { vehicleName: "Audi Q3" }, pickupDateAndTime: "2026-04-10T10:00:00Z", returnDateAndTime: "2026-04-12T10:00:00Z", totalCost: "250.00", status: "cancelled" },
                        { id: "BK-1203", vehicleInformation: { vehicleName: "Volkswagen Golf" }, pickupDateAndTime: "2026-03-15T08:00:00Z", returnDateAndTime: "2026-03-17T08:00:00Z", totalCost: "210.00", status: "completed" },
                        { id: "BK-1204", vehicleInformation: { vehicleName: "Volkswagen Passat" }, pickupDateAndTime: "2026-02-10T12:00:00Z", returnDateAndTime: "2026-02-12T12:00:00Z", totalCost: "220.00", status: "completed" },
                        { id: "BK-1205", vehicleInformation: { vehicleName: "Volkswagen Golf" }, pickupDateAndTime: "2026-01-20T10:00:00Z", returnDateAndTime: "2026-01-22T10:00:00Z", totalCost: "200.00", status: "completed" }
                ]
        },
        {
                id: "RT-011",
                fullname: "Sophia Lee",
                phoneNumber: "+1-555-111-3344",
                licenseNumber: "DL-3344556",
                email: "sophia.lee@hospital.org",
                status: "verified",
                totalSpent: 520.00,
                totalBookings: 2,
                dateJoined: "2024-12-05T08:00:00Z",
                slug: "sophia-lee",
                location: "Philadelphia, PA",
                lastActive: "2026-05-05T20:00:00Z",
                dateOfBirth: "1993-02-28",
                address: "220 Liberty St, Philadelphia, PA 19106",
                verification: {
                        dateSubmitted: "2024-12-05T08:30:00Z",
                        documentType: "Driver's License"
                },
                booking: [
                        { id: "BK-1301", vehicleInformation: { vehicleName: "Aston Martin DB5" }, pickupDateAndTime: "2026-05-07T00:00:00Z", returnDateAndTime: "2026-05-10T00:00:00Z", totalCost: "5000.00", status: "cancelled" },
                        { id: "BK-1302", vehicleInformation: { vehicleName: "Lotus Esprit" }, pickupDateAndTime: "2026-04-01T00:00:00Z", returnDateAndTime: "2026-04-05T00:00:00Z", totalCost: "5000.00", status: "completed" },
                        { id: "BK-1303", vehicleInformation: { vehicleName: "BMW Z8" }, pickupDateAndTime: "2026-03-01T00:00:00Z", returnDateAndTime: "2026-03-05T00:00:00Z", totalCost: "5000.00", status: "completed" },
                        { id: "BK-1304", vehicleInformation: { vehicleName: "Jaguar XKR" }, pickupDateAndTime: "2026-02-01T00:00:00Z", returnDateAndTime: "2026-02-05T00:00:00Z", totalCost: "5000.00", status: "completed" },
                        { id: "BK-1305", vehicleInformation: { vehicleName: "Aston Martin DBS" }, pickupDateAndTime: "2026-01-01T00:00:00Z", returnDateAndTime: "2026-01-05T00:00:00Z", totalCost: "5000.00", status: "completed" }
                ]
        },
        {
                id: "RT-012",
                fullname: "James Bond",
                phoneNumber: "+44-555-007-0007",
                email: "j.bond@mi6.gov.uk",
                status: "rejected",
                totalSpent: 0,
                totalBookings: 0,
                dateJoined: "2026-05-01T00:07:00Z",
                slug: "james-bond",
                location: "London, UK",
                lastActive: "2026-05-01T01:00:00Z",
                dateOfBirth: "1968-11-01",
                address: "85 Albert Embankment, London",
                verification: {
                        dateSubmitted: "2026-05-01T00:10:00Z",
                        documentType: "Military ID"
                },
                booking: []
        },
        {
                id: "RT-013",
                fullname: "Isabella Garcia",
                phoneNumber: "+1-555-131-4455",
                licenseNumber: "DL-9900112",
                email: "i.garcia@boutique.com",
                status: "verified",
                totalSpent: 980.00,
                totalBookings: 4,
                dateJoined: "2025-01-20T14:20:00Z",
                slug: "isabella-garcia",
                location: "Los Angeles, CA",
                lastActive: "2026-05-11T16:45:00Z",
                dateOfBirth: "1996-12-12",
                address: "1020 Hollywood Blvd, Los Angeles, CA 90028",
                verification: {
                        dateSubmitted: "2025-01-20T15:00:00Z",
                        documentType: "Driver's License"
                },
                booking: [
                        { id: "BK-1501", vehicleInformation: { vehicleName: "BMW M4" }, pickupDateAndTime: "2026-06-15T10:00:00Z", returnDateAndTime: "2026-06-20T10:00:00Z", totalCost: "850.00", status: "active" },
                        { id: "BK-1502", vehicleInformation: { vehicleName: "Audi RS6" }, pickupDateAndTime: "2026-05-01T09:00:00Z", returnDateAndTime: "2026-05-05T09:00:00Z", totalCost: "1000.00", status: "completed" },
                        { id: "BK-1503", vehicleInformation: { vehicleName: "Porsche Taycan" }, pickupDateAndTime: "2026-04-10T10:00:00Z", returnDateAndTime: "2026-04-12T10:00:00Z", totalCost: "900.00", status: "completed" },
                        { id: "BK-1504", vehicleInformation: { vehicleName: "BMW M4" }, pickupDateAndTime: "2026-03-05T08:00:00Z", returnDateAndTime: "2026-03-08T08:00:00Z", totalCost: "750.00", status: "completed" },
                        { id: "BK-1505", vehicleInformation: { vehicleName: "Mercedes GLE" }, pickupDateAndTime: "2026-02-15T12:00:00Z", returnDateAndTime: "2026-02-18T12:00:00Z", totalCost: "750.00", status: "completed" }
                ]
        },
        {
                id: "RT-014",
                fullname: "Thomas Müller",
                phoneNumber: "+49-555-242-1314",
                licenseNumber: "DL-DE-4455",
                email: "t.mueller@bayern.de",
                status: "verified",
                totalSpent: 600.00,
                totalBookings: 1,
                dateJoined: "2025-09-30T10:00:00Z",
                slug: "thomas-mueller",
                location: "Munich, Germany",
                lastActive: "2026-05-10T19:00:00Z",
                dateOfBirth: "1989-09-13",
                address: "Säbener Str. 51, 81547 München",
                verification: {
                        dateSubmitted: "2025-09-30T10:30:00Z",
                        documentType: "Passport"
                },
                booking: [
                        { id: "BK-1601", vehicleInformation: { vehicleName: "Volvo XC90" }, pickupDateAndTime: "2026-05-11T09:00:00Z", returnDateAndTime: "2026-05-14T17:00:00Z", totalCost: "360.00", status: "active" },
                        { id: "BK-1602", vehicleInformation: { vehicleName: "Tesla Model Y" }, pickupDateAndTime: "2026-04-05T10:00:00Z", returnDateAndTime: "2026-04-08T10:00:00Z", totalCost: "400.00", status: "completed" },
                        { id: "BK-1603", vehicleInformation: { vehicleName: "Volvo XC90" }, pickupDateAndTime: "2026-03-10T08:00:00Z", returnDateAndTime: "2026-03-13T08:00:00Z", totalCost: "340.00", status: "completed" },
                        { id: "BK-1604", vehicleInformation: { vehicleName: "Toyota Highlander" }, pickupDateAndTime: "2026-02-15T12:00:00Z", returnDateAndTime: "2026-02-18T12:00:00Z", totalCost: "350.00", status: "completed" },
                        { id: "BK-1605", vehicleInformation: { vehicleName: "Volvo XC90" }, pickupDateAndTime: "2026-01-20T09:00:00Z", returnDateAndTime: "2026-01-23T09:00:00Z", totalCost: "350.00", status: "completed" }
                ]
        },
        {
                id: "RT-015",
                fullname: "Grace Hopper",
                phoneNumber: "+1-555-151-5566",
                licenseNumber: "DL-COBOL-1",
                email: "g.hopper@navy.mil",
                status: "verified",
                totalSpent: 300.00,
                totalBookings: 2,
                dateJoined: "2024-01-01T00:00:00Z",
                slug: "grace-hopper",
                location: "Arlington, VA",
                lastActive: "2026-05-11T12:00:00Z",
                dateOfBirth: "1906-12-09",
                address: "Pentagon, Washington, DC",
                verification: {
                        dateSubmitted: "2024-01-01T08:00:00Z",
                        documentType: "Military ID"
                },
                booking: [
                        { id: "BK-1601", vehicleInformation: { vehicleName: "Volvo XC90" }, pickupDateAndTime: "2026-05-11T09:00:00Z", returnDateAndTime: "2026-05-14T17:00:00Z", totalCost: "360.00", status: "active" },
                        { id: "BK-1602", vehicleInformation: { vehicleName: "Tesla Model Y" }, pickupDateAndTime: "2026-04-05T10:00:00Z", returnDateAndTime: "2026-04-08T10:00:00Z", totalCost: "400.00", status: "completed" },
                        { id: "BK-1603", vehicleInformation: { vehicleName: "Volvo XC90" }, pickupDateAndTime: "2026-03-10T08:00:00Z", returnDateAndTime: "2026-03-13T08:00:00Z", totalCost: "340.00", status: "completed" },
                        { id: "BK-1604", vehicleInformation: { vehicleName: "Toyota Highlander" }, pickupDateAndTime: "2026-02-15T12:00:00Z", returnDateAndTime: "2026-02-18T12:00:00Z", totalCost: "350.00", status: "completed" },
                        { id: "BK-1605", vehicleInformation: { vehicleName: "Volvo XC90" }, pickupDateAndTime: "2026-01-20T09:00:00Z", returnDateAndTime: "2026-01-23T09:00:00Z", totalCost: "350.00", status: "completed" }
                ]
        }
];