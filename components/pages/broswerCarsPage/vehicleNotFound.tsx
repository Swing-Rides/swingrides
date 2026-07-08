import Link from "next/link";

export default function VehicleNotFound() {
        return (
                <div className="min-h-[70dvh] bg-gray-200 flex items-center justify-center">
                        <div className="space-y-3">
                                <h3 className="text-4xl text-center">
                                        This vehicle can not be found
                                </h3>
                                <div className="flex gap-3 items-center justify-center">
                                        <Link 
                                                href={'/'}
                                                className="py-2 px-6 text-black border border-black bg-transparent hover:text-white hover:bg-black rounded-xs transition-colors duration-300"
                                        >
                                                Go Home
                                        </Link>
                                        <Link 
                                                href={'/browse-cars'}
                                                className="py-2 px-6 bg-blue-700 border border-blue-700 text-white rounded-xs hover:border-blue-950 hover:bg-blue-950 transition-colors duration-300"
                                        >
                                                Browse Cars
                                        </Link>
                                </div>
                        </div>
                </div>
        )
}
