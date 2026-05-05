type CarDataProps = {
        id: number;
        imageUrl: string;
        name: string;
        price: {
                hourly: number;
                daily: number;
                weekly: number;
        }
        reviewsAndRatings: {
                averageRating: number;
                totalRating: number;
                totalReviews: number;
                totalRatings: {
                        oneStar: string;
                        twoStar: string;
                        threeStar: string;
                        fourStar: string;
                        fiveStar: string;
                };
                recentReviews: {
                        name: string;
                        date: string;
                        rating: number;
                        comment: string;
                }[];
        }
        specifications: {
                seats: number;
                fuelType: string;
                transmission: string;
                make: string;
                model: string;
                year: number;
                bodyType: string;
                engine: string;
                horsepower: number;
                driveType: string;
                fuelEfficiency: string;
                doors: number;
                color: string;
                mileage: string;
        }

        status: string;
        overview: string;
        host: {
                id: number;
                name: string;
                memberSince: string;
                tripsCompleted: number;
                rating: number;
                contactNumber: string;
        };
        
}

export const ProcessCarCardData = (data: CarDataProps) => {
        return {
                id: data.id,
                imageUrl: data.imageUrl,
                name: data.name,
                averageRating: data.reviewsAndRatings.averageRating,
                totalRating: data.reviewsAndRatings.totalRating,
                seats: data.specifications.seats,
                fuelType: data.specifications.fuelType,
                transmission: data.specifications.transmission,
                dailyPrice: data.price?.daily,
        }
}