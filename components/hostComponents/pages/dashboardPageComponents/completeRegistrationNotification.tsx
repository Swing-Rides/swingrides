import { HostPlanType } from "@/app/store/services/settingsApi";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
} from "lucide-react";

type CompleteRegistrationNotificationProp = {
        handleOpenRegistrationModal: () => void;
        status: string;
        plan: HostPlanType;
}

export default function CompleteRegistrationNotification({ handleOpenRegistrationModal, status, plan }: CompleteRegistrationNotificationProp ) {
        return (
                <div className="mt-8 p-5 md:p-6 rounded-md border border-amber-200 bg-amber-50 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-3">
                                <div className="size-12 rounded-[10px] bg-amber-100 flex items-center justify-center shrink-0">
                                        <ShieldAlert className="size-6 text-amber-600" />
                                </div>
                                <div className="space-y-1">
                                        <h3 className="text-neutral-950 text-lg font-semibold font-text">
                                                Complete your host registration
                                        </h3>
                                        <p className="text-sm text-gray-600 font-text">
                                                Your {plan} plan payment is still{" "}
                                                {status}. Finish this step to unlock your host
                                                account setup and verification flow.
                                        </p>
                                </div>
                        </div>
                        <Button
                              type="button"
                              onClick={handleOpenRegistrationModal}
                              className="bg-blue-700 hover:bg-blue-950 rounded-xs text-white"
                        >
                              Complete Registration
                        </Button>
                </div>
        )
}
