import { PageIntro } from "@/components/pages/connectToHostPage";
import { FileCheck } from "lucide-react";
import BusinessLicenseVerificationForm from "../forms/businessLicenseVerificationForm";

type PageInfo = {
        title: string;
        label: string;
}

type HostVerifyAccountProps = {
        activePlan: string;
        planFee: string;
        fleetSize: string;
        userIsVerified: boolean;
};

export default function HostVerifyAccount(
        { 
                activePlan='flex', 
                planFee='$99/month', 
                fleetSize='1 vehicle',
                userIsVerified=false,
        } : HostVerifyAccountProps) {

        const info: PageInfo[] = [
                {
                        title: "Plan",
                        label: activePlan,
                },
                {
                        title: "Price",
                        label: planFee,
                },
                {
                        title: "Fleet Size",
                        label: fleetSize,
                },
        ]
        
        return (
                <div className="space-y-5 p-3">
                        <div>
                                <PageIntro
                                        imageSrc="/images/active-plan.svg"
                                        pageTitle="Your Plan is Active 🎉"
                                        description="You've successfully subscribed to the Professional plan. You can now start managing your fleet."
                                />
                        </div>
                        <div className="p-4 md:p-8 max-w-112.5 mx-auto bg-white rounded-[10px] border border-gray-200 w-full flex flex-col justify-start items-start gap-5">
                                {info.map((item) => (
                                        <div 
                                                className="flex justify-between items-center w-full"
                                                key={item.title}
                                        >
                                                <p className="text-left text-gray-500 text-sm font-normal font-text leading-5">
                                                        {item.title}
                                                </p>
                                                <span className="text-right text-neutral-950 text-sm font-semibold font-text leading-5">
                                                        {item.label}
                                                </span>
                                        </div>
                                ))}
                        </div>
                        <div className="p-4 md:p-8 max-w-112.5 mx-auto bg-white rounded-[10px] border border-gray-200 w-full flex flex-col justify-start items-start gap-5">
                                {userIsVerified ? (
                                        <div className="flex items-center justify-center text-center p-3 rounded-[10px] bg-green-100">
                                                <span className="flex text-green-700 text-sm font-medium font-text leading-5">
                                                        Your account has been verified, continue listing your vehicls and making lots of money
                                                </span>
                                        </div>
                                ):(<>
                                        <div className="flex justify-start items-start gap-3">
                                                <div className="size-8 aspect-square flex items-center justify-center bg-amber-100 rounded-full">
                                                        <FileCheck className="text-amber-500 size-4"/>
                                                </div>
                                                <div className="space-y-2">
                                                        <h3 className="text-neutral-950 text-base font-medium font-text">
                                                                One last step — verify your business
                                                        </h3>
                                                        <span className="block text-gray-500 text-sm font-medium font-text leading-5">
                                                                Upload your business license to complete your host verification. This helps us maintain a trusted platform for all renters.
                                                        </span>
                                                </div>
                                        </div>
                                        <BusinessLicenseVerificationForm />
                                </>)}
                        </div>
                </div>
        )
}
