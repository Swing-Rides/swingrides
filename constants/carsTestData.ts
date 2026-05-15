import { FleetStatus } from "@/types/subscribers.type";

export interface PricingTierType {
        hourly: number;
        daily: number;
        weekly: number;
        monthly: number;
}

export interface CarSpecificationsType {
        make: string;
        model: string;
        year: number;
        bodyType: string;
        engine: string;
        horsepower: number;
        transmission: string;
        driveType: string;
        fuelType: string;
        fuelEfficiency: string;
        seats: number;
        doors: number;
        color: string;
        mileage: string;
        features?: string[];
}

export interface HostInfoType {
        id?: string;
        hostName: string;
        memberSince: string;
        tripsCompleted: number;
        rating: number;
        contactNumber: string;
}

export interface ReviewType {
        id: string;
        name: string;
        date: string;
        rating: number;
        comment: string;
}

export interface RatingsBreakdownType {
        starNumber: number;
        starRated: number;
}

export interface ReviewsAndRatingsType {
        averageRating: number;
        totalReviews: number;
        totalRatings?: number;
        starRatingBreakdown: RatingsBreakdownType[];
        reviews: ReviewType[];
}

export interface CarDataType {
        id?: string;
        featuredImage: {
                src: string;
                alt: string;
        };
        gallery: {
                id: string;
                src: string;
                alt: string;
        }[];
        carName: string;
        slug?: string;
        plateNumber: string;
        price: PricingTierType;
        status: FleetStatus;
        overview: string;
        specifications: CarSpecificationsType;
        host: HostInfoType;
        reviewsAndRatings: ReviewsAndRatingsType;
}

export const carsTestData: CarDataType[] = [
        {
                id: 'metroCarRentals-toyotaCamry-012024',
                featuredImage: {
                        src: `/images/bmw-m4-competition-2024.webp`,
                        alt: `BMW M4 Competition`,
                },
                gallery:[
                        {
                                id: '1g3fy8373',
                                src: '/images/bmw-m4-competition-2024-side-view.webp',
                                alt: 'bmw m4 competition 2024 side view',
                        },
                        {
                                id: 'h983hdfb',
                                src: '/images/bmw-m4-competition-2024-interior-view.webp',
                                alt: 'front interior view',
                        },
                        {
                                id: '0a9uavdf3',
                                src: '/images/bmw-m4-competition-2024-left-side-view.webp',
                                alt: 'left side view',
                        },
                        {
                                id: 'xab763gdb',
                                src: '/images/bmw-m4-competition-2024-engine.webp',
                                alt: 'bmw m4 competition 2024 engine',
                        },
                        {
                                id: 'nam9a ',
                                src: '/images/bmw-m4-competition-2024-front-close-up.webp',
                                alt: 'bmw m4 competition 2024 front close up',
                        },
                ],
                carName: `BMW M4 Competition`,
                slug: `bmw-m4-competition-metroCarRentals-toyotaCamry-012024`,
                plateNumber: `ABC-1234`,
                price: {
                        hourly: 25,
                        daily: 150,
                        weekly: 900,
                        monthly: 3150,
                },
                status: `available`,
                overview: `The BMW 3 Series combines sporty performance with everyday practicality. Perfect for business trips or weekend getaways. This 2024 model comes fully serviced and ready to drive.`,
                specifications: {
                        make: 'BMW',
                        model: '3 Series',
                        year: 2024,
                        bodyType: 'Sedan',
                        engine: '2.0L Turbocharged I4',
                        horsepower: 255,
                        transmission: 'Automatic (8-speed)',
                        driveType: 'Rear-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '8.1L / 100km',
                        seats: 5,
                        doors: 4,
                        color: 'Sliver',
                        mileage: '11,200 km',
                        features: [
                                "Air Conditioning",
                                "GPS Navigation",
                                "Sunroof",
                                "Bluetooth",
                                "USB Charging",
                                "Backup Camera",
                        ],
                },
                host: {
                        id: 'saiu8y8723hbd98',
                        hostName: 'Metro Car Rentals',
                        memberSince: 'Jan 2025',
                        tripsCompleted: 47,
                        rating: 4.9,
                        contactNumber: '555-123-4567',
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRatings: 98,
                        totalReviews: 87,
                        starRatingBreakdown: [
                                {
                                        starNumber: 1,
                                        starRated: 2,
                                },
                                {
                                        starNumber: 2,
                                        starRated: 5,
                                },
                                {
                                        starNumber: 3,
                                        starRated: 3,
                                },
                                {
                                        starNumber: 4,
                                        starRated: 93,
                                },
                                {
                                        starNumber: 5,
                                        starRated: 6,
                                },
                        ],
                        reviews: [
                                {
                                        id: '86723g8d7b',
                                        name: 'John S.',
                                        date: 'March 10, 2025',
                                        rating: 5,
                                        comment: 'Absolutely loved this car. Picked it up in perfect condition and the host was very responsive. Would rent again.'
                                },
                                {
                                        id: 'zsbau9whd',
                                        name: 'Priya M.',
                                        date: 'Feb 28, 2026',
                                        rating: 4,
                                        comment: 'Great car, smooth drive. Pickup was easy. Only minor issue was a small delay in getting the keys but overall a great experience.'
                                },
                                {
                                        id: 'azbiasubea9e8',
                                        name: 'David O.',
                                        date: 'Feb 14, 2026',
                                        rating: 5,
                                        comment: 'Immaculate condition, drives beautifully. The host was professional and the booking process was seamless.'
                                },
                        ]
                }
        },
        {
                id: 'urbanRentalsUK-toyotaCamry-012024',
                featuredImage: {
                        src: `/images/toyota-camry-2024.webp`,
                        alt: `Toyota Camry`,
                },
                gallery: [
                        {
                                id: '1g3fy8373',
                                src: '/images/test-interior-1.webp',
                                alt: 'interior part 1',
                        },
                        {
                                id: 'h983hdfb',
                                src: '/images/test-interior-1.webp',
                                alt: 'interior part 1',
                        },
                        {
                                id: '0a9uavdf3',
                                src: '/images/test-interior-1.webp',
                                alt: 'interior part 1',
                        },
                        {
                                id: 'xab763gdb',
                                src: '/images/test-interior-1.webp',
                                alt: 'interior part 1',
                        },
                        {
                                id: 'nam9a ',
                                src: '/images/test-interior-1.webp',
                                alt: 'interior part 1',
                        },
                ],
                carName: `Toyota Camry`,
                slug: `toyota-camry-urbanRentalsUK-toyotaCamry-012024`,
                plateNumber: `ABC-1234`,
                price: {
                        hourly: 25,
                        daily: 150,
                        weekly: 900,
                        monthly: 3150,
                },
                status: `available`,
                overview: `The BMW 3 Series combines sporty performance with everyday practicality. Perfect for business trips or weekend getaways. This 2024 model comes fully serviced and ready to drive.`,
                specifications: {
                        make: 'BMW',
                        model: '3 Series',
                        year: 2024,
                        bodyType: 'Sedan',
                        engine: '2.0L Turbocharged I4',
                        horsepower: 255,
                        transmission: 'Automatic (8-speed)',
                        driveType: 'Rear-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '8.1L / 100km',
                        seats: 5,
                        doors: 4,
                        color: 'Sliver',
                        mileage: '11,200 km',
                        features: [
                                "Air Conditioning",
                                "GPS Navigation",
                                "Sunroof",
                                "Bluetooth",
                                "USB Charging",
                                "Backup Camera",
                        ],
                },
                host: {
                        id: 'saiu8y8723hbd98',
                        hostName: 'Metro Car Rentals',
                        memberSince: 'Jan 2025',
                        tripsCompleted: 47,
                        rating: 4.9,
                        contactNumber: '555-123-4567',
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalReviews: 87,
                        starRatingBreakdown: [
                                {
                                        starNumber: 1,
                                        starRated: 0,
                                },
                                {
                                        starNumber: 2,
                                        starRated: 1,
                                },
                                {
                                        starNumber: 3,
                                        starRated: 67,
                                },
                                {
                                        starNumber: 4,
                                        starRated: 84,
                                },
                                {
                                        starNumber: 5,
                                        starRated: 23,
                                },
                        ],
                        reviews: [
                                {
                                        id: '86723g8d7b',
                                        name: 'John S.',
                                        date: 'March 10, 2025',
                                        rating: 5,
                                        comment: 'Absolutely loved this car. Picked it up in perfect condition and the host was very responsive. Would rent again.'
                                },
                                {
                                        id: 'zsbau9whd',
                                        name: 'Priya M.',
                                        date: 'Feb 28, 2026',
                                        rating: 4,
                                        comment: 'Great car, smooth drive. Pickup was easy. Only minor issue was a small delay in getting the keys but overall a great experience.'
                                },
                                {
                                        id: 'azbiasubea9e8',
                                        name: 'David O.',
                                        date: 'Feb 14, 2026',
                                        rating: 5,
                                        comment: 'Immaculate condition, drives beautifully. The host was professional and the booking process was seamless.'
                                },
                        ]
                }
        },
        {
                id: 'coastalCarSharing-toyotaCamry-012024',
                featuredImage: {
                        src: `/images/test-cars/2025-Mercedes-Benz-S-Class-AMG-S-63-E-PERFORMANCE-Sedan-Exterior.webp`,
                        alt: `BMW M4 Competition`,
                },
                gallery: [
                        {
                                id: '1sft373',
                                src: `/images/test-cars/2025-Mercedes-Benz-S-Class-AMG-S-63-E-PERFORMANCE-Sedan-Exterior.webp`,
                                alt: `BMW M4 Competition`,
                        },
                        {
                                id: '1g3fy8373',
                                src: '/images/test-cars/2025_mercedes-benz_s-class_sedan_s-580-4matic_shf_oem_1_1600x1067.webp',
                                alt: 'interior part 1',
                        },
                        {
                                id: 'h983hdfb',
                                src: '/images/test-cars/2025_mercedes-benz_s-class_sedan_s-580-4matic_detail_oem_12_1600x1067.webp',
                                alt: 'interior part 1',
                        },
                        {
                                id: '0a9uavdf3',
                                src: '/images/test-cars/2025_mercedes-benz_s-class_sedan_amg-s-63-e-performance_i_oem_1_1600x1067.webp',
                                alt: 'interior part 1',
                        },
                        {
                                id: 'xab763gdb',
                                src: '/images/test-cars/2025_mercedes-benz_s-class_sedan_amg-s-63-e-performance_detail_oem_2_1600x1067.webp',
                                alt: 'interior part 1',
                        },
                        {
                                id: 'nam9a ',
                                src: '/images/test-cars/2025_mercedes-benz_s-class_sedan_amg-s-63-e-performance_detail_oem_1_1600x1067.webp',
                                alt: 'interior part 1',
                        },
                ],
                carName: `Mercedes-Benz S-Class S 580 4MATIC`,
                slug: `mercedes-benz-s-class-s-580-4matic`,
                plateNumber: `ABC-1234`,
                price: {
                        hourly: 10,
                        daily: 186,
                        weekly: 1250,
                        monthly: 4375,
                },
                status: `available`,
                overview: `The 2025 Mercedes-Benz S-Class S 580 4MATIC Sedan is a pinnacle luxury sedan featuring a 4.0L V8 biturbo engine with mild-hybrid EQ Boost, 4MATIC all-wheel drive, and a 9G-TRONIC automatic transmission. It offers advanced features like AIRMATIC suspension, optional rear-axle steering, a Burmester 3D sound system, and extensive safety, including front/rear side airbags`,
                specifications: {
                        make: 'Mercedes-Benz S-Class',
                        model: 'S580 4MATIC Sedan',
                        year: 2025,
                        bodyType: 'Sedan',
                        engine: '4.0L V8 biturbo engine with mild-hybrid EQ Boost',
                        horsepower: 496,
                        transmission: 'Automatic (9G-TRONIC)',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '12 L/100 km',
                        seats: 5,
                        doors: 4,
                        color: 'Black',
                        mileage: '67,298 km',
                        features: [
                                "4MATIC All-Wheel Drive",
                                "Panorama roof",
                                "All-LED exterior/interior lighting",
                                "Heated/Active Ventilated front seats",
                                "Burmester sound system",
                                "Front and rear side airbags",
                                "Front and rear head airbags",
                                "Active parking assist",
                                "Adaptive cruise control",
                        ],
                },
                host: {
                        id: 'saiu8y8723hbd98',
                        hostName: 'Metro Car Rentals',
                        memberSince: 'Jan 2025',
                        tripsCompleted: 47,
                        rating: 4.9,
                        contactNumber: '555-123-4567',
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalReviews: 87,
                        starRatingBreakdown: [
                                {
                                        starNumber: 1,
                                        starRated: 2,
                                },
                                {
                                        starNumber: 2,
                                        starRated: 2,
                                },
                                {
                                        starNumber: 3,
                                        starRated: 10,
                                },
                                {
                                        starNumber: 4,
                                        starRated: 30,
                                },
                                {
                                        starNumber: 5,
                                        starRated: 176,
                                },
                        ],
                        reviews: [
                                {
                                        id: '86723g8d7b',
                                        name: 'John S.',
                                        date: 'March 10, 2025',
                                        rating: 5,
                                        comment: 'Absolutely loved this car. Picked it up in perfect condition and the host was very responsive. Would rent again.'
                                },
                                {
                                        id: 'zsbau9whd',
                                        name: 'Priya M.',
                                        date: 'Feb 28, 2026',
                                        rating: 4,
                                        comment: 'Great car, smooth drive. Pickup was easy. Only minor issue was a small delay in getting the keys but overall a great experience.'
                                },
                                {
                                        id: 'azbiasubea9e8',
                                        name: 'David O.',
                                        date: 'Feb 14, 2026',
                                        rating: 5,
                                        comment: 'Immaculate condition, drives beautifully. The host was professional and the booking process was seamless.'
                                },
                        ]
                }
        },
        {
                id: 'premiumDrives-porsche911-032024',
                featuredImage: {
                        src: `/images/test-cars/porsche-911-carrera-2024.webp`,
                        alt: `Porsche 911 Carrera`,
                },
                gallery: [
                        { id: 'p1a2b3c4', src: '/images/test-cars/Porsche-911-Carrera-2024-side-rear-view.webp', alt: 'porsche 911 side view' },
                        { id: 'p2b3c4d5', src: '/images/test-cars/Porsche-911-Carrera-2024-side-view.webp', alt: 'porsche 911 interior' },
                        { id: 'p3c4d5e6', src: '/images/test-cars/Porsche-911-Carrera-2024-interior.webp', alt: 'porsche 911 rear view' },
                        { id: 'p4d5e6f7', src: '/images/test-cars/Porsche-911-Carrera-2024-interior-1.webp', alt: 'porsche 911 engine' },
                ],
                carName: `Porsche 911 Carrera`,
                slug: `porsche-911-carrera-premiumDrives-032024`,
                plateNumber: `PRE-9110`,
                price: {
                        hourly: 45,
                        daily: 320,
                        weekly: 2000,
                        monthly: 7000,
                },
                status: `available`,
                overview: `The iconic Porsche 911 Carrera — a sports car legend that blends everyday drivability with exhilarating performance. This 2024 model features the latest PDK transmission and the unmistakable flat-six soundtrack.`,
                specifications: {
                        make: 'Porsche',
                        model: '911 Carrera',
                        year: 2024,
                        bodyType: 'Coupe',
                        engine: '3.0L Twin-Turbo Flat-6',
                        horsepower: 379,
                        transmission: 'Automatic (8-speed PDK)',
                        driveType: 'Rear-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '10.2L / 100km',
                        seats: 4,
                        doors: 2,
                        color: 'Guards Red',
                        mileage: '8,450 km',
                        features: [
                                "Sport Chrono Package",
                                "BOSE Surround Sound",
                                "Heated Front Seats",
                                "Panoramic Roof",
                                "Lane Keep Assist",
                                "Apple CarPlay",
                                "Adaptive Cruise Control",
                        ],
                },
                host: {
                        id: 'host-premiumDrives-001',
                        hostName: 'Premium Drives',
                        memberSince: 'Mar 2024',
                        tripsCompleted: 31,
                        rating: 4.8,
                        contactNumber: '555-234-5678',
                },
                reviewsAndRatings: {
                        averageRating: 4.8,
                        totalRatings: 54,
                        totalReviews: 48,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 0 },
                                { starNumber: 2, starRated: 1 },
                                { starNumber: 3, starRated: 3 },
                                { starNumber: 4, starRated: 12 },
                                { starNumber: 5, starRated: 38 },
                        ],
                        reviews: [
                                { id: 'r1a2b3', name: 'Chidi A.', date: 'Apr 2, 2026', rating: 5, comment: 'An absolute dream to drive. Every corner felt planted and the sound was incredible.' },
                                { id: 'r2b3c4', name: 'Fatima K.', date: 'Mar 18, 2026', rating: 5, comment: 'Flawless experience from pickup to drop-off. The car was immaculate.' },
                                { id: 'r3c4d5', name: 'Emeka J.', date: 'Feb 22, 2026', rating: 4, comment: 'Amazing performance. Wish the boot had a bit more space but I expected that.' },
                        ]
                }
        },
        {
                id: 'cityGlide-tesla-modelS-042025',
                featuredImage: {
                        src: `/images/test-cars/2026_tesla_model-s_sedan_base_fqn_izmo_1_1600x1067.webp`,
                        alt: `Tesla Model S Plaid`,
                },
                gallery: [
                        { id: 't1a2b3c4', src: '/images/test-cars/2026_tesla_model-s_sedan_base_en_izmo_1_1600x1067.webp', alt: 'tesla model s dashboard' },
                        { id: 't2b3c4d5', src: '/images/test-cars/2026_tesla_model-s_sedan_plaid_detail_oem_1_1600x1067.webp', alt: 'tesla model s interior' },
                        { id: 't3c4d5e6', src: '/images/test-cars/2026_tesla_model-s_sedan_plaid_rq_oem_1_1600x1067.webp', alt: 'tesla model s side view' },
                        { id: 't4d5e6f7', src: '/images/test-cars/2026_tesla_model-s_sedan_base_ca_izmo_1_300.webp', alt: 'tesla model s rear view' },
                ],
                carName: `Tesla Model S Plaid`,
                slug: `tesla-model-s-plaid-cityGlide-042025`,
                plateNumber: `EV-0001`,
                price: {
                        hourly: 38,
                        daily: 260,
                        weekly: 1650,
                        monthly: 3150,
                },
                status: `available`,
                overview: `The fastest production sedan ever made. The Tesla Model S Plaid delivers 1,020 horsepower and 0–100 km/h in under 2.1 seconds. Perfect for those who want the future of driving today.`,
                specifications: {
                        make: 'Tesla',
                        model: 'Model S Plaid',
                        year: 2024,
                        bodyType: 'Sedan',
                        engine: 'Tri-Motor Electric',
                        horsepower: 1020,
                        transmission: 'Single-Speed Automatic',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Electric`,
                        fuelEfficiency: '2.1 km/Wh',
                        seats: 5,
                        doors: 4,
                        color: 'Midnight Silver Metallic',
                        mileage: '14,300 km',
                        features: [
                                "Autopilot",
                                "17-inch Cinematic Display",
                                "Premium Audio System",
                                "Over-the-Air Updates",
                                "Heated/Cooled Seats",
                                "Full Self-Driving (FSD) Capability",
                                "Glass Roof",
                        ],
                },
                host: {
                        id: 'host-cityGlide-002',
                        hostName: 'City Glide Rentals',
                        memberSince: 'Jun 2024',
                        tripsCompleted: 62,
                        rating: 4.9,
                        contactNumber: '555-345-6789',
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRatings: 88,
                        totalReviews: 75,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 0 },
                                { starNumber: 2, starRated: 2 },
                                { starNumber: 3, starRated: 4 },
                                { starNumber: 4, starRated: 18 },
                                { starNumber: 5, starRated: 64 },
                        ],
                        reviews: [
                                { id: 'r4d5e6', name: 'Ngozi B.', date: 'Apr 10, 2026', rating: 5, comment: 'The acceleration is something else entirely. My passengers were speechless.' },
                                { id: 'r5e6f7', name: 'Tunde M.', date: 'Mar 28, 2026', rating: 5, comment: 'Autopilot on the highway was seamless. Charged from 20% to 90% in under 30 mins at the supercharger.' },
                                { id: 'r6f7g8', name: 'Amara O.', date: 'Mar 5, 2026', rating: 4, comment: 'Fantastic car, the screen is massive. Only knocked a star because finding a charger took longer than expected.' },
                        ]
                }
        },
        {
                id: 'rangeRovers-rr-sport-052024',
                featuredImage: {
                        src: `/images/test-cars/range-rover-sport-2024.webp`,
                        alt: `Range Rover Sport`,
                },
                gallery: [
                        { id: 'rr1a2b3', src: '/images/test-cars/range-rover-sport-side.webp', alt: 'range rover sport side view' },
                        { id: 'rr2b3c4', src: '/images/test-cars/range-rover-sport-interior.webp', alt: 'range rover sport interior' },
                        { id: 'rr3c4d5', src: '/images/test-cars/range-rover-sport-rear.webp', alt: 'range rover sport rear view' },
                        { id: 'rr4d5e6', src: '/images/test-cars/range-rover-sport-off-road.webp', alt: 'range rover sport off road' },
                        { id: 'rr5e6f7', src: '/images/test-cars/range-rover-sport-front.webp', alt: 'range rover sport front' },
                ],
                carName: `Range Rover Sport HSE`,
                slug: `range-rover-sport-hse-rangeRovers-052024`,
                plateNumber: `RRS-5500`,
                price: {
                        hourly: 40,
                        daily: 280,
                        weekly: 1800,
                        monthly: 4150,
                },
                status: `available`,
                overview: `Commanding presence, luxury interior, and serious off-road capability. The 2024 Range Rover Sport HSE offers the perfect blend of performance and refinement for any road condition.`,
                specifications: {
                        make: 'Land Rover',
                        model: 'Range Rover Sport HSE',
                        year: 2024,
                        bodyType: 'SUV',
                        engine: '3.0L Inline-6 MHEV',
                        horsepower: 395,
                        transmission: 'Automatic (8-speed)',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '11.8L / 100km',
                        seats: 5,
                        doors: 4,
                        color: 'Santorini Black',
                        mileage: '22,100 km',
                        features: [
                                "Terrain Response 2",
                                "Air Suspension",
                                "Meridian Sound System",
                                "Panoramic Sunroof",
                                "Head-Up Display",
                                "Wade Sensing",
                                "Massage Seats",
                        ],
                },
                host: {
                        id: 'host-rangeRovers-003',
                        hostName: 'Range Rovers Ltd',
                        memberSince: 'Feb 2024',
                        tripsCompleted: 44,
                        rating: 4.7,
                        contactNumber: '555-456-7890',
                },
                reviewsAndRatings: {
                        averageRating: 4.7,
                        totalRatings: 66,
                        totalReviews: 58,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 1 },
                                { starNumber: 2, starRated: 2 },
                                { starNumber: 3, starRated: 5 },
                                { starNumber: 4, starRated: 22 },
                                { starNumber: 5, starRated: 36 },
                        ],
                        reviews: [
                                { id: 'r7g8h9', name: 'Kemi L.', date: 'Apr 5, 2026', rating: 5, comment: 'Effortless on the highway and on dirt roads. The air suspension made every surface feel smooth.' },
                                { id: 'r8h9i0', name: 'Bode P.', date: 'Mar 12, 2026', rating: 4, comment: 'Extremely comfortable SUV, fuel consumption is a bit high but expected for this class.' },
                                { id: 'r9i0j1', name: 'Sola R.', date: 'Feb 8, 2026', rating: 5, comment: 'Absolutely loved it. The Meridian sound system made every drive feel like a concert.' },
                        ]
                }
        },
        {
                id: 'eliteAutos-lamboHuracan-062024',
                featuredImage: {
                        src: `/images/test-cars/lamborghini-huracan-2024.webp`,
                        alt: `Lamborghini Huracán EVO`,
                },
                gallery: [
                        { id: 'lh1a2b3', src: '/images/test-cars/lamborghini-huracan-side.webp', alt: 'lamborghini huracan side view' },
                        { id: 'lh2b3c4', src: '/images/test-cars/lamborghini-huracan-interior.webp', alt: 'lamborghini huracan interior' },
                        { id: 'lh3c4d5', src: '/images/test-cars/lamborghini-huracan-rear.webp', alt: 'lamborghini huracan rear' },
                        { id: 'lh4d5e6', src: '/images/test-cars/lamborghini-huracan-engine.webp', alt: 'lamborghini huracan engine' },
                        { id: 'lh5e6f7', src: '/images/test-cars/lamborghini-huracan-front.webp', alt: 'lamborghini huracan front' },
                ],
                carName: `Lamborghini Huracán EVO`,
                slug: `lamborghini-huracan-evo-eliteAutos-062024`,
                plateNumber: `ELT-0047`,
                price: {
                        hourly: 120,
                        daily: 850,
                        weekly: 5500,
                        monthly: 19250,
                },
                status: `available`,
                overview: `The Lamborghini Huracán EVO is pure Italian drama on four wheels. A naturally aspirated V10 screaming to 8,000 RPM and a body that turns every street into a runway. An experience unlike anything else.`,
                specifications: {
                        make: 'Lamborghini',
                        model: 'Huracán EVO',
                        year: 2024,
                        bodyType: 'Coupe',
                        engine: '5.2L Naturally Aspirated V10',
                        horsepower: 630,
                        transmission: 'Automatic (7-speed LDF)',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '15.7L / 100km',
                        seats: 2,
                        doors: 2,
                        color: 'Arancio Borealis (Orange)',
                        mileage: '5,200 km',
                        features: [
                                "Lamborghini Dinamica Veicolo Integrata (LDVI)",
                                "Magnetic Ride Suspension",
                                "Lamborghini Infotainment System (LIS)",
                                "Carbon Ceramic Brakes",
                                "Launch Control",
                                "Rear-View Camera",
                                "Apple CarPlay",
                        ],
                },
                host: {
                        id: 'host-eliteAutos-004',
                        hostName: 'Elite Autos',
                        memberSince: 'Jan 2024',
                        tripsCompleted: 19,
                        rating: 5.0,
                        contactNumber: '555-567-8901',
                },
                reviewsAndRatings: {
                        averageRating: 5.0,
                        totalRatings: 22,
                        totalReviews: 19,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 0 },
                                { starNumber: 2, starRated: 0 },
                                { starNumber: 3, starRated: 0 },
                                { starNumber: 4, starRated: 2 },
                                { starNumber: 5, starRated: 20 },
                        ],
                        reviews: [
                                { id: 'r10j1k2', name: 'Ife C.', date: 'Apr 14, 2026', rating: 5, comment: 'The sound from that V10 is something I will never forget. Worth every naira.' },
                                { id: 'r11k2l3', name: 'Dayo F.', date: 'Mar 30, 2026', rating: 5, comment: 'Unbelievable car. The host walked us through everything. Felt safe and confident the whole time.' },
                                { id: 'r12l3m4', name: 'Zara T.', date: 'Mar 1, 2026', rating: 5, comment: 'Life-changing experience. The attention we got was unreal. Already planning to book again.' },
                        ]
                }
        },
        {
                id: 'driveSmartNG-honda-crv-072024',
                featuredImage: {
                        src: `/images/test-cars/honda-crv-2024.webp`,
                        alt: `Honda CR-V Hybrid`,
                },
                gallery: [
                        { id: 'hc1a2b3', src: '/images/test-cars/honda-crv-side.webp', alt: 'honda crv side view' },
                        { id: 'hc2b3c4', src: '/images/test-cars/honda-crv-interior.webp', alt: 'honda crv interior' },
                        { id: 'hc3c4d5', src: '/images/test-cars/honda-crv-rear.webp', alt: 'honda crv rear view' },
                        { id: 'hc4d5e6', src: '/images/test-cars/honda-crv-cargo.webp', alt: 'honda crv cargo space' },
                        { id: 'hc5e6f7', src: '/images/test-cars/honda-crv-front.webp', alt: 'honda crv front view' },
                ],
                carName: `Honda CR-V Hybrid`,
                slug: `honda-crv-hybrid-driveSmartNG-072024`,
                plateNumber: `DSM-4421`,
                price: {
                        hourly: 15,
                        daily: 95,
                        weekly: 600,
                        monthly: 3150,
                },
                status: `available`,
                overview: `The Honda CR-V Hybrid is the practical choice for families and road trippers alike. Great fuel economy, a roomy interior, and Honda's trusted reliability make it ideal for any journey.`,
                specifications: {
                        make: 'Honda',
                        model: 'CR-V Hybrid',
                        year: 2024,
                        bodyType: 'SUV',
                        engine: '2.0L Atkinson-Cycle 4-Cylinder + Dual Electric Motors',
                        horsepower: 204,
                        transmission: 'eCVT',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Hybrid`,
                        fuelEfficiency: '6.6L / 100km',
                        seats: 5,
                        doors: 4,
                        color: 'Sonic Gray Pearl',
                        mileage: '33,700 km',
                        features: [
                                "Honda Sensing Safety Suite",
                                "Wireless Apple CarPlay/Android Auto",
                                "Heated Front Seats",
                                "Power Moonroof",
                                "Hands-Free Power Tailgate",
                                "Multi-Angle Rearview Camera",
                                "Remote Engine Start",
                        ],
                },
                host: {
                        id: 'host-driveSmartNG-005',
                        hostName: 'DriveSmart NG',
                        memberSince: 'Apr 2024',
                        tripsCompleted: 89,
                        rating: 4.8,
                        contactNumber: '555-678-9012',
                },
                reviewsAndRatings: {
                        averageRating: 4.8,
                        totalRatings: 112,
                        totalReviews: 98,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 1 },
                                { starNumber: 2, starRated: 2 },
                                { starNumber: 3, starRated: 8 },
                                { starNumber: 4, starRated: 35 },
                                { starNumber: 5, starRated: 66 },
                        ],
                        reviews: [
                                { id: 'r13m4n5', name: 'Ada U.', date: 'Apr 8, 2026', rating: 5, comment: 'Perfect family car. Spacious, comfortable, and very fuel efficient. Will rent again.' },
                                { id: 'r14n5o6', name: 'Kunle S.', date: 'Mar 22, 2026', rating: 4, comment: 'Smooth and easy to drive. The hybrid engine was barely noticeable — just quiet efficiency.' },
                                { id: 'r15o6p7', name: 'Yemi W.', date: 'Feb 14, 2026', rating: 5, comment: 'The boot space alone sold me. Fit all our luggage with room to spare.' },
                        ]
                }
        },
        {
                id: 'abujaDrive-audi-q7-082024',
                featuredImage: {
                        src: `/images/test-cars/audi-q7-2024.webp`,
                        alt: `Audi Q7 Quattro`,
                },
                gallery: [
                        { id: 'aq1a2b3', src: '/images/test-cars/audi-q7-side.webp', alt: 'audi q7 side view' },
                        { id: 'aq2b3c4', src: '/images/test-cars/audi-q7-interior.webp', alt: 'audi q7 interior' },
                        { id: 'aq3c4d5', src: '/images/test-cars/audi-q7-rear.webp', alt: 'audi q7 rear view' },
                        { id: 'aq4d5e6', src: '/images/test-cars/audi-q7-dashboard.webp', alt: 'audi q7 dashboard' },
                        { id: 'aq5e6f7', src: '/images/test-cars/audi-q7-front.webp', alt: 'audi q7 front view' },
                ],
                carName: `Audi Q7 55 TFSI Quattro`,
                slug: `audi-q7-55-tfsi-quattro-abujaDrive-082024`,
                plateNumber: `ABJ-7755`,
                price: {
                        hourly: 35,
                        daily: 230,
                        weekly: 1450,
                        monthly: 5075,
                },
                status: `available`,
                overview: `The Audi Q7 Quattro is the premium 7-seat SUV for those who refuse to compromise. Audi's legendary build quality, a cutting-edge MMI infotainment system, and Quattro AWD make every journey effortless.`,
                specifications: {
                        make: 'Audi',
                        model: 'Q7 55 TFSI Quattro',
                        year: 2024,
                        bodyType: 'SUV',
                        engine: '3.0L Turbocharged V6',
                        horsepower: 335,
                        transmission: 'Automatic (8-speed Tiptronic)',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '11.2L / 100km',
                        seats: 7,
                        doors: 4,
                        color: 'Glacier White Metallic',
                        mileage: '18,600 km',
                        features: [
                                "Quattro All-Wheel Drive",
                                "Audi Virtual Cockpit",
                                "Bang & Olufsen 3D Sound",
                                "Adaptive Air Suspension",
                                "Third-Row Seating",
                                "Night Vision Assist",
                                "Wireless Charging",
                        ],
                },
                host: {
                        id: 'host-abujaDrive-006',
                        hostName: 'Abuja Drive Hub',
                        memberSince: 'May 2024',
                        tripsCompleted: 53,
                        rating: 4.9,
                        contactNumber: '555-789-0123',
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRatings: 74,
                        totalReviews: 65,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 0 },
                                { starNumber: 2, starRated: 1 },
                                { starNumber: 3, starRated: 3 },
                                { starNumber: 4, starRated: 16 },
                                { starNumber: 5, starRated: 54 },
                        ],
                        reviews: [
                                { id: 'r16p7q8', name: 'Tobi A.', date: 'Apr 12, 2026', rating: 5, comment: 'Seven seats and still felt premium. All my family fit comfortably for a long journey.' },
                                { id: 'r17q8r9', name: 'Nkechi G.', date: 'Mar 25, 2026', rating: 5, comment: 'The Audi Virtual Cockpit is stunning. Everything was intuitive and the car was spotless.' },
                                { id: 'r18r9s0', name: 'Lekan D.', date: 'Feb 20, 2026', rating: 4, comment: 'Solid car. Powerful, quiet, and refined. Slightly firm on bad roads though.' },
                        ]
                }
        },
        {
                id: 'naijaMobility-toyota-hilux-092024',
                featuredImage: {
                        src: `/images/test-cars/toyota-hilux-2024.webp`,
                        alt: `Toyota Hilux GR Sport`,
                },
                gallery: [
                        { id: 'th1a2b3', src: '/images/test-cars/toyota-hilux-side.webp', alt: 'toyota hilux side view' },
                        { id: 'th2b3c4', src: '/images/test-cars/toyota-hilux-interior.webp', alt: 'toyota hilux interior' },
                        { id: 'th3c4d5', src: '/images/test-cars/toyota-hilux-bed.webp', alt: 'toyota hilux truck bed' },
                        { id: 'th4d5e6', src: '/images/test-cars/toyota-hilux-off-road.webp', alt: 'toyota hilux off road' },
                        { id: 'th5e6f7', src: '/images/test-cars/toyota-hilux-front.webp', alt: 'toyota hilux front view' },
                ],
                carName: `Toyota Hilux GR Sport`,
                slug: `toyota-hilux-gr-sport-naijaMobility-092024`,
                plateNumber: `NJM-4X40`,
                price: {
                        hourly: 20,
                        daily: 140,
                        weekly: 880,
                        monthly: 3150,
                },
                status: `available`,
                overview: `Built for any road or lack thereof. The Toyota Hilux GR Sport combines the legendary Hilux toughness with sporty GR styling. Ideal for long-distance road trips, construction site visits, or off-road adventures.`,
                specifications: {
                        make: 'Toyota',
                        model: 'Hilux GR Sport',
                        year: 2024,
                        bodyType: 'Pickup Truck',
                        engine: '2.8L Diesel Turbocharged 4-Cylinder',
                        horsepower: 204,
                        transmission: 'Automatic (6-speed)',
                        driveType: '4-Wheel Drive',
                        fuelType: `Diesel`,
                        fuelEfficiency: '9.1L / 100km',
                        seats: 5,
                        doors: 4,
                        color: 'Graphite',
                        mileage: '27,400 km',
                        features: [
                                "4WD with Locking Rear Differential",
                                "GR Sport Body Kit",
                                "Touchscreen Infotainment",
                                "Trailer Assist",
                                "Downhill Assist Control",
                                "Multi-Terrain Monitor",
                                "Bed Liner",
                        ],
                },
                host: {
                        id: 'host-naijaMobility-007',
                        hostName: 'Naija Mobility',
                        memberSince: 'Jul 2024',
                        tripsCompleted: 38,
                        rating: 4.6,
                        contactNumber: '555-890-1234',
                },
                reviewsAndRatings: {
                        averageRating: 4.6,
                        totalRatings: 48,
                        totalReviews: 41,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 1 },
                                { starNumber: 2, starRated: 2 },
                                { starNumber: 3, starRated: 6 },
                                { starNumber: 4, starRated: 15 },
                                { starNumber: 5, starRated: 24 },
                        ],
                        reviews: [
                                { id: 'r19s0t1', name: 'Gbenga M.', date: 'Apr 3, 2026', rating: 5, comment: 'Handled every bad road like it was nothing. Perfect for the trip I had in mind.' },
                                { id: 'r20t1u2', name: 'Amina H.', date: 'Mar 10, 2026', rating: 4, comment: 'Powerful pickup, drives well on highways. Cabin is a bit noisy at high speeds.' },
                                { id: 'r21u2v3', name: 'Seun B.', date: 'Feb 28, 2026', rating: 5, comment: 'Reliable and sturdy. The host was professional and had it fuelled and ready.' },
                        ]
                }
        },
        {
                id: 'luxeWheelsLagos-rolls-ghost-102024',
                featuredImage: {
                        src: `/images/test-cars/rolls-royce-ghost-2024.webp`,
                        alt: `Rolls-Royce Ghost`,
                },
                gallery: [
                        { id: 'rg1a2b3', src: '/images/test-cars/rolls-royce-ghost-side.webp', alt: 'rolls royce ghost side view' },
                        { id: 'rg2b3c4', src: '/images/test-cars/rolls-royce-ghost-interior.webp', alt: 'rolls royce ghost interior' },
                        { id: 'rg3c4d5', src: '/images/test-cars/rolls-royce-ghost-starlight.webp', alt: 'rolls royce starlight headliner' },
                        { id: 'rg4d5e6', src: '/images/test-cars/rolls-royce-ghost-rear.webp', alt: 'rolls royce ghost rear view' },
                        { id: 'rg5e6f7', src: '/images/test-cars/rolls-royce-ghost-front.webp', alt: 'rolls royce ghost front view' },
                ],
                carName: `Rolls-Royce Ghost`,
                slug: `rolls-royce-ghost-luxeWheelsLagos-102024`,
                plateNumber: `LWL-0001`,
                price: {
                        hourly: 200,
                        daily: 1400,
                        weekly: 9000,
                        monthly: 34200,
                },
                status: `available`,
                overview: `The Rolls-Royce Ghost is the definitive statement in ultra-luxury motoring. Whisper-quiet ride, handcrafted Phantom-grade interior, and the iconic Spirit of Ecstasy on the bonnet. Reserve for weddings, corporate events, or simply the finest of occasions.`,
                specifications: {
                        make: 'Rolls-Royce',
                        model: 'Ghost',
                        year: 2024,
                        bodyType: 'Sedan',
                        engine: '6.75L Twin-Turbocharged V12',
                        horsepower: 563,
                        transmission: 'Automatic (8-speed ZF)',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '16.8L / 100km',
                        seats: 5,
                        doors: 4,
                        color: 'Arctic White',
                        mileage: '4,100 km',
                        features: [
                                "Starlight Headliner",
                                "Bespoke Audio System",
                                "Massage Seats Front & Rear",
                                "Night Vision",
                                "Lambswool Floor Mats",
                                "Illuminated Fascia",
                                "Flagbearer Headlights",
                        ],
                },
                host: {
                        id: 'host-luxeWheelsLagos-008',
                        hostName: 'Luxe Wheels Lagos',
                        memberSince: 'Nov 2023',
                        tripsCompleted: 14,
                        rating: 5.0,
                        contactNumber: '555-901-2345',
                },
                reviewsAndRatings: {
                        averageRating: 5.0,
                        totalRatings: 16,
                        totalReviews: 14,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 0 },
                                { starNumber: 2, starRated: 0 },
                                { starNumber: 3, starRated: 0 },
                                { starNumber: 4, starRated: 1 },
                                { starNumber: 5, starRated: 15 },
                        ],
                        reviews: [
                                { id: 'r22v3w4', name: 'Bayo A.', date: 'Apr 16, 2026', rating: 5, comment: 'Used it for my wedding. Every single guest was speechless. Truly magical experience.' },
                                { id: 'r23w4x5', name: 'Chisom E.', date: 'Mar 5, 2026', rating: 5, comment: 'The quietest ride I have ever been in. The starlight ceiling alone is worth the price.' },
                                { id: 'r24x5y6', name: 'Femi O.', date: 'Jan 28, 2026', rating: 5, comment: 'Reserved it for a board event. Our guests were thoroughly impressed. The host delivered on every promise.' },
                        ]
                }
        },
        {
                id: 'affordableRides-kia-sportage-112024',
                featuredImage: {
                        src: `/images/test-cars/kia-sportage-2024.webp`,
                        alt: `Kia Sportage Hybrid`,
                },
                gallery: [
                        { id: 'ks1a2b3', src: '/images/test-cars/kia-sportage-side.webp', alt: 'kia sportage side view' },
                        { id: 'ks2b3c4', src: '/images/test-cars/kia-sportage-interior.webp', alt: 'kia sportage interior' },
                        { id: 'ks3c4d5', src: '/images/test-cars/kia-sportage-rear.webp', alt: 'kia sportage rear view' },
                        { id: 'ks4d5e6', src: '/images/test-cars/kia-sportage-dash.webp', alt: 'kia sportage dashboard' },
                        { id: 'ks5e6f7', src: '/images/test-cars/kia-sportage-front.webp', alt: 'kia sportage front view' },
                ],
                carName: `Kia Sportage Hybrid`,
                slug: `kia-sportage-hybrid-affordableRides-112024`,
                plateNumber: `AFR-2240`,
                price: {
                        hourly: 12,
                        daily: 80,
                        weekly: 500,
                        monthly: 2800,
                },
                status: `available`,
                overview: `The Kia Sportage Hybrid punches well above its price bracket. Smart design, a large panoramic display, and hybrid efficiency make it an excellent everyday choice at a very accessible price point.`,
                specifications: {
                        make: 'Kia',
                        model: 'Sportage Hybrid',
                        year: 2024,
                        bodyType: 'SUV',
                        engine: '1.6L Turbocharged 4-Cylinder + Electric Motor',
                        horsepower: 227,
                        transmission: 'Automatic (6-speed',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Hybrid`,
                        fuelEfficiency: '6.9L / 100km',
                        seats: 5,
                        doors: 4,
                        color: 'Snow White Pearl',
                        mileage: '41,200 km',
                        features: [
                                "12.3-inch Panoramic Display",
                                "Harman Kardon Audio",
                                "Wireless Apple CarPlay",
                                "Heated & Ventilated Seats",
                                "Surround View Monitor",
                                "Highway Driving Assist",
                                "Remote Smart Parking Assist",
                        ],
                },
                host: {
                        id: 'host-affordableRides-009',
                        hostName: 'Affordable Rides NG',
                        memberSince: 'Aug 2024',
                        tripsCompleted: 104,
                        rating: 4.7,
                        contactNumber: '555-012-3456',
                },
                reviewsAndRatings: {
                        averageRating: 4.7,
                        totalRatings: 138,
                        totalReviews: 119,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 2 },
                                { starNumber: 2, starRated: 3 },
                                { starNumber: 3, starRated: 12 },
                                { starNumber: 4, starRated: 48 },
                                { starNumber: 5, starRated: 73 },
                        ],
                        reviews: [
                                { id: 'r25y6z7', name: 'Funke A.', date: 'Apr 18, 2026', rating: 5, comment: 'Great value for money. Clean, modern, and fuel efficient. Cannot ask for more at this price.' },
                                { id: 'r26z7a8', name: 'Ola T.', date: 'Mar 14, 2026', rating: 4, comment: 'Nice interior for the price. The panoramic screen is impressive. A tiny rattle from the dash but nothing major.' },
                                { id: 'r27a8b9', name: 'Sade M.', date: 'Feb 5, 2026', rating: 5, comment: 'Picked up fresh and clean, returned with no issues. Will use Affordable Rides again.' },
                        ]
                }
        },
        {
                id: 'executiveMoves-maybach-s680-122024',
                featuredImage: {
                        src: `/images/test-cars/mercedes-maybach-s680-2024.webp`,
                        alt: `Mercedes-Maybach S 680`,
                },
                gallery: [
                        { id: 'mm1a2b3', src: '/images/test-cars/mercedes-maybach-s680-side.webp', alt: 'mercedes maybach s680 side view' },
                        { id: 'mm2b3c4', src: '/images/test-cars/mercedes-maybach-s680-interior.webp', alt: 'mercedes maybach s680 interior' },
                        { id: 'mm3c4d5', src: '/images/test-cars/mercedes-maybach-s680-rear.webp', alt: 'mercedes maybach s680 rear' },
                        { id: 'mm4d5e6', src: '/images/test-cars/mercedes-maybach-s680-seats.webp', alt: 'mercedes maybach rear seats' },
                        { id: 'mm5e6f7', src: '/images/test-cars/mercedes-maybach-s680-front.webp', alt: 'mercedes maybach s680 front' },
                ],
                carName: `Mercedes-Maybach S 680`,
                slug: `mercedes-maybach-s680-executiveMoves-122024`,
                plateNumber: `EXM-6800`,
                price: {
                        hourly: 180,
                        daily: 1200,
                        weekly: 7800,
                        monthly: 27300,
                },
                status: `available`,
                overview: `The Mercedes-Maybach S 680 is chauffeur-grade luxury at its most extreme. An extended wheelbase rear cabin with reclining first-class seats, champagne cooler, and a twin-turbo V12 engine make this the ultimate executive transport.`,
                specifications: {
                        make: 'Mercedes-Benz',
                        model: 'Maybach S 680',
                        year: 2024,
                        bodyType: 'Sedan',
                        engine: '6.0L Twin-Turbocharged V12',
                        horsepower: 621,
                        transmission: 'Automatic (9G-TRONIC)',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '15.3L / 100km',
                        seats: 4,
                        doors: 4,
                        color: 'Onyx Black / Leather Brown Two-Tone',
                        mileage: '6,800 km',
                        features: [
                                "Extended Wheelbase",
                                "First-Class Rear Suite Seats",
                                "Rear Champagne Cooler",
                                "Burmester High-End 3D Surround Sound",
                                "Executive Rear Seat Package",
                                "AIRMATIC Air Suspension",
                                "Fragrance System",
                        ],
                },
                host: {
                        id: 'host-executiveMoves-010',
                        hostName: 'Executive Moves',
                        memberSince: 'Dec 2023',
                        tripsCompleted: 22,
                        rating: 5.0,
                        contactNumber: '555-123-6789',
                },
                reviewsAndRatings: {
                        averageRating: 5.0,
                        totalRatings: 25,
                        totalReviews: 22,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 0 },
                                { starNumber: 2, starRated: 0 },
                                { starNumber: 3, starRated: 0 },
                                { starNumber: 4, starRated: 2 },
                                { starNumber: 5, starRated: 23 },
                        ],
                        reviews: [
                                { id: 'r28b9c0', name: 'Biodun K.', date: 'Apr 20, 2026', rating: 5, comment: 'Used it for an airport pickup for our international clients. The impression was priceless.' },
                                { id: 'r29c0d1', name: 'Ifeoma N.', date: 'Mar 18, 2026', rating: 5, comment: 'The rear cabin is better than most first class airline seats. Absolutely world class.' },
                                { id: 'r30d1e2', name: 'Rotimi S.', date: 'Feb 10, 2026', rating: 5, comment: 'Booked for a corporate event. The host ensured the car arrived pristine and on time.' },
                        ]
                }
        },
        {
                id: 'speedHub-ford-mustang-gt-012025',
                featuredImage: {
                        src: `/images/test-cars/ford-mustang-gt-2024.webp`,
                        alt: `Ford Mustang GT`,
                },
                gallery: [
                        { id: 'fm1a2b3', src: '/images/test-cars/ford-mustang-gt-side.webp', alt: 'ford mustang gt side view' },
                        { id: 'fm2b3c4', src: '/images/test-cars/ford-mustang-gt-interior.webp', alt: 'ford mustang gt interior' },
                        { id: 'fm3c4d5', src: '/images/test-cars/ford-mustang-gt-rear.webp', alt: 'ford mustang gt rear view' },
                        { id: 'fm4d5e6', src: '/images/test-cars/ford-mustang-gt-engine.webp', alt: 'ford mustang gt engine' },
                        { id: 'fm5e6f7', src: '/images/test-cars/ford-mustang-gt-front.webp', alt: 'ford mustang gt front view' },
                ],
                carName: `Ford Mustang GT`,
                slug: `ford-mustang-gt-speedHub-012025`,
                plateNumber: `SPD-5050`,
                price: {
                        hourly: 30,
                        daily: 195,
                        weekly: 1250,
                        monthly: 4375,
                },
                status: `available`,
                overview: `An American icon reborn. The 2024 Ford Mustang GT delivers a thundering 5.0L V8 soundtrack, muscle-car attitude, and modern tech wrapped in a timeless silhouette. Perfect for weekend drives that demand attention.`,
                specifications: {
                        make: 'Ford',
                        model: 'Mustang GT',
                        year: 2024,
                        bodyType: 'Coupe',
                        engine: '5.0L Naturally Aspirated V8 (Coyote)',
                        horsepower: 486,
                        transmission: 'Manual (6-speed)',
                        driveType: 'Rear-Wheel Drive',
                        fuelType: `Gas`,
                        fuelEfficiency: '13.4L / 100km',
                        seats: 4,
                        doors: 2,
                        color: 'Race Red',
                        mileage: '9,800 km',
                        features: [
                                "Active Valve Performance Exhaust",
                                "MagneRide Damping System",
                                "13.2-inch Touchscreen",
                                "B&O Sound System",
                                "Launch Control",
                                "Track Apps",
                                "Reverse Brake Assist",
                        ],
                },
                host: {
                        id: 'host-speedHub-011',
                        hostName: 'Speed Hub NG',
                        memberSince: 'Feb 2025',
                        tripsCompleted: 27,
                        rating: 4.8,
                        contactNumber: '555-234-7890',
                },
                reviewsAndRatings: {
                        averageRating: 4.8,
                        totalRatings: 38,
                        totalReviews: 33,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 0 },
                                { starNumber: 2, starRated: 1 },
                                { starNumber: 3, starRated: 2 },
                                { starNumber: 4, starRated: 10 },
                                { starNumber: 5, starRated: 25 },
                        ],
                        reviews: [
                                { id: 'r31e2f3', name: 'Tola O.', date: 'Apr 22, 2026', rating: 5, comment: 'The exhaust note alone was worth it. Every traffic stop became a spectacle.' },
                                { id: 'r32f3g4', name: 'Kola B.', date: 'Mar 16, 2026', rating: 5, comment: 'Manual gearbox was so satisfying. Felt like a real driver. Highly recommend.' },
                                { id: 'r33g4h5', name: 'Dupe L.', date: 'Feb 22, 2026', rating: 4, comment: 'Superb on open roads. Not the most practical in Lagos traffic but the experience is unmatched.' },
                        ]
                }
        },
        {
                id: 'greenFleet-hyundai-ioniq6-022025',
                featuredImage: {
                        src: `/images/test-cars/hyundai-ioniq6-2024.webp`,
                        alt: `Hyundai IONIQ 6`,
                },
                gallery: [
                        { id: 'hi1a2b3', src: '/images/test-cars/hyundai-ioniq6-side.webp', alt: 'hyundai ioniq6 side view' },
                        { id: 'hi2b3c4', src: '/images/test-cars/hyundai-ioniq6-interior.webp', alt: 'hyundai ioniq6 interior' },
                        { id: 'hi3c4d5', src: '/images/test-cars/hyundai-ioniq6-rear.webp', alt: 'hyundai ioniq6 rear view' },
                        { id: 'hi4d5e6', src: '/images/test-cars/hyundai-ioniq6-dash.webp', alt: 'hyundai ioniq6 dashboard' },
                        { id: 'hi5e6f7', src: '/images/test-cars/hyundai-ioniq6-front.webp', alt: 'hyundai ioniq6 front view' },
                ],
                carName: `Hyundai IONIQ 6 Long Range AWD`,
                slug: `hyundai-ioniq6-long-range-awd-greenFleet-022025`,
                plateNumber: `GRN-0006`,
                price: {
                        hourly: 18,
                        daily: 120,
                        weekly: 750,
                        monthly: 3150,
                },
                status: `available`,
                overview: `The Hyundai IONIQ 6 is the sleek, aerodynamic EV sedan redefining what electric cars can look and feel like. With up to 614km of range and 800V ultra-fast charging, it's the most practical long-distance EV in its class.`,
                specifications: {
                        make: 'Hyundai',
                        model: 'IONIQ 6 Long Range AWD',
                        year: 2024,
                        bodyType: 'Sedan',
                        engine: 'Dual Electric Motor',
                        horsepower: 320,
                        transmission: 'Single-Speed Automatic',
                        driveType: 'All-Wheel Drive',
                        fuelType: `Electric`,
                        fuelEfficiency: '6.2 km/kWh',
                        seats: 5,
                        doors: 4,
                        color: 'Gravity Gold Matte',
                        mileage: '19,300 km',
                        features: [
                                "800V Ultra-Fast Charging",
                                "12-inch Dual Cockpit Display",
                                "Vehicle-to-Load (V2L)",
                                "Relaxation Seats",
                                "Highway Driving Assist 2",
                                "Pixel LED Headlights",
                                "Digital Side Mirrors",
                        ],
                },
                host: {
                        id: 'host-greenFleet-012',
                        hostName: 'Green Fleet NG',
                        memberSince: 'Mar 2025',
                        tripsCompleted: 41,
                        rating: 4.9,
                        contactNumber: '555-345-8901',
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRatings: 56,
                        totalReviews: 48,
                        starRatingBreakdown: [
                                { starNumber: 1, starRated: 0 },
                                { starNumber: 2, starRated: 0 },
                                { starNumber: 3, starRated: 3 },
                                { starNumber: 4, starRated: 14 },
                                { starNumber: 5, starRated: 39 },
                        ],
                        reviews: [
                                { id: 'r34h5i6', name: 'Zainab O.', date: 'Apr 24, 2026', rating: 5, comment: 'Charged from 10% to 80% in under 20 minutes. The range anxiety people talk about is a myth with this car.' },
                                { id: 'r35i6j7', name: 'Emeka S.', date: 'Mar 20, 2026', rating: 5, comment: 'Stunning design inside and out. The V2L feature powered my laptop and projector at an event.' },
                                { id: 'r36j7k8', name: 'Chidera P.', date: 'Feb 18, 2026', rating: 4, comment: 'Silky smooth and very efficient. Slight learning curve with the digital mirrors but loved every bit.' },
                        ]
                }
        },
]

export const carsCardData = [
        {
                id: 'metroCarRentals-toyotaCamry-012024',
                imageUrl: `/images/bmw-m4-competition-2024.webp`,
                carName: `BMW M4 Competition`,
                slug: `bmw-m4-competition-metroCarRentals-toyotaCamry-012024`,
                price: {
                        daily: 150,
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRating: 98,
                },
                specifications: {
                        transmission: 'Automatic (8-speed)',
                        fuelType: `Gas`,
                        seats: 5,
                },
        },
        {
                id: 'urbanRentalsUK-toyotaCamry-012024',
                imageUrl: `/images/toyota-camry-2024.webp`,
                carName: `Toyota Camry 2024`,
                slug: `toyota-camry-urbanRentalsUK-toyotaCamry-012024`,
                price: {
                        daily: 150,
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRating: 98,
                },
                specifications: {
                        transmission: 'Automatic (8-speed)',
                        fuelType: `Gas`,
                        seats: 5,
                },
        },
        {
                id: 'coastalCarSharing-toyotaCamry-012024',
                imageUrl: `/images/test-car-1.webp`,
                carName: `BMW M4 Competition`,
                slug: `bmw-m4-competition-coastalCarSharing-toyotaCamry-012024`,
                price: {
                        daily: 150,
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRating: 98,
                },
                specifications: {
                        transmission: 'Automatic (8-speed)',
                        fuelType: `Gas`,
                        seats: 5,
                },
        },
        {
                id: 'nordicVentures-toyotaCamry-012024',
                imageUrl: `/images/test-car-1.webp`,
                carName: `BMW M4 Competition`,
                slug: `bmw-m4-competition-nordicVentures-toyotaCamry-012024`,
                price: {
                        daily: 150,
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRating: 98,
                },
                specifications: {
                        transmission: 'Automatic (8-speed)',
                        fuelType: `Gas`,
                        seats: 5,
                },
        },
        {
                id: '5',
                imageUrl: `/images/test-car-1.webp`,
                carName: `BMW M4 Competition`,
                slug: `bmw-m4-competition-5`,
                price: {
                        daily: 150,
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRating: 98,
                },
                specifications: {
                        transmission: 'Automatic (8-speed)',
                        fuelType: `Gas`,
                        seats: 5,
                },
        },
        {
                id: '6',
                imageUrl: `/images/test-car-1.webp`,
                carName: `BMW M4 Competition`,
                slug: `bmw-m4-competition-6`,
                price: {
                        daily: 150,
                },
                reviewsAndRatings: {
                        averageRating: 4.9,
                        totalRating: 98,
                },
                specifications: {
                        transmission: 'Automatic (8-speed)',
                        fuelType: `Gas`,
                        seats: 5,
                },
        },

]

export const vehicleTypeFilterData = {
        filterTitle: 'Vehicle Type',
        content: [
                {
                        id: 'sedan',
                        title: 'Sedan'
                },
                {
                        id: 'suv',
                        title: 'SUV'
                },
                {
                        id: 'hatchback',
                        title: 'Hatchback'
                },
                {
                        id: 'van',
                        title: 'Van'
                },
                {
                        id: 'luxury',
                        title: 'Luxury'
                },
                {
                        id: 'convertible',
                        title: 'Convertible'
                },
        ]
}

export const transmissionFilterData = {
        filterTitle: 'Transmission',
        content: [
                {
                        id: 'any',
                        title: 'Any'
                },
                {
                        id: 'automatic',
                        title: 'Automatic'
                },
                {
                        id: 'manual',
                        title: 'Manual'
                },
        ]
}

export const carSeatsFilterData = {
        filterTitle: 'Seats',
        content: [
                {
                        id: 'any',
                        title: 'Any'
                },
                {
                        id: 'two',
                        title: '2'
                },
                {
                        id: 'four',
                        title: '4'
                },
                {
                        id: 'five',
                        title: '5'
                },
                {
                        id: 'seven-plus',
                        title: '7+'
                },
        ]
}

export const carsSortData = [
        { id: 1, value: 'default', label: 'Default' },
        { id: 2, value: 'price-asc', label: 'Price: Low to High' },
        { id: 3, value: 'price-desc', label: 'Price: High to Low' },
        { id: 4, value: 'rating-desc', label: 'Top Rated' },
        { id: 5, value: 'rating-asc', label: 'Lowest Rated' },
        { id: 6, value: 'name-asc', label: 'Name A-Z' },
]