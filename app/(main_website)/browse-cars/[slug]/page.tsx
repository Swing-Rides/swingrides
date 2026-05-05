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
                        <CarPageComponent content={content}/>
                </>
        )
}
