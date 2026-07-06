import { XCircle } from "lucide-react";
import Link from "next/link";

type PaymentUnsuccessfulProps = {
        paymentId: string;
}

export default function PaymentUnsuccessful({ paymentId }: PaymentUnsuccessfulProps) {
        return (
                <div className="bg-white max-w-130 p-4 md:p-8 rounded-lg border border-gray-200 w-full mx-auto flex flex-col justify-center items-center gap-4">
                        <div className="bg-red-500 size-18 aspect-square rounded-full flex items-center justify-center">
                                <XCircle className="text-white size-10"/>
                        </div>
                        <h2 className="text-center text-neutral-950 text-3xl font-normal font-sans leading-12">
                                Payment Unsuccessful
                        </h2>
                        <p className="text-center text-gray-500 text-base font-normal font-text leading-6">
                                We were unable to process your payment. No charge has been made. Please try again.
                        </p>
                        <div className="py-3.5 px-6 bg-indigo-50 rounded-full mt-2 mb-4">
                                <p className="text-blue-700 text-sm font-medium font-text leading-5">
                                        Payment Ref: {paymentId}
                                </p>
                        </div>
                        <div className="flex gap-3 flex-wrap w-full">
                                <Link
                                        href={`checkout/${paymentId}`}
                                        className='flex-1 text-sm font-medium font-text text-nowrap text-center leading-5 border border-blue-700 text-white rounded-xs py-2 px-4 bg-blue-700 hover:bg-blue-950 transition-colors duration-300 cursor-pointer'
                                >
                                        Try Again
                                </Link>
                                <Link
                                        href={'/browse-cars'}
                                        className='flex-1 text-sm font-medium font-text text-nowrap text-center leading-5 border border-red-500 text-red-500 rounded-xs py-2 px-4 bg-transparent hover:bg-red-700 hover:text-gray-100 hover:border-red-700 transition-colors duration-300 cursor-pointer'
                                >
                                        Cancel Booking
                                </Link>
                        </div>
                        <div className="text-center flex items-center justify-center gap-1">
                                <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                        Need help?
                                </span>
                                <Link 
                                        className="text-blue-700 text-sm font-normal font-text leading-5 hover:text-blue-950 duration-300 transition-colors"
                                        href={'/contact-support'}
                                >
                                        Contact support
                                </Link>
                        </div>
                </div>
        )
}
