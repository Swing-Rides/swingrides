import CarPageComponent from "@/components/pages/broswerCarsPage/carPageComponent"
import { carsTestData } from "@/constants/carsTestData"

export default async function CarPage({
                params,
        }: {
                params: Promise<{ slug: string }>
        }) {

        const { slug } = await params

        const content = carsTestData.find(
                item => item.slug?.toLowerCase() === slug.toLowerCase()
        );

        if (!content) {
                return (
                        <div>
                                This page can not be found
                        </div>
                )
        }

        return (
                <>
                        {/* id: {slug} */}
                        <CarPageComponent 
                                carName={content.carName}
                                featuredImage={content.featuredImage} 
                                gallery={content.gallery} 
                                reviewsAndRatings={content.reviewsAndRatings} 
                                status={content.status} 
                                specifications={content.specifications} 
                                overview={content.overview} 
                                host={content.host} 
                                price={{
                                        daily: 195,
                                        weekly: 1250,
                                        monthly: 4500,
                                }} 
                                pickupLocation={"2100 Epic Pl, Grand Prairie, TX 75052, United States"}
                        />
                </>
        )
}
