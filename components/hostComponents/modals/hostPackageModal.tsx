"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import RegistrationPayment, {
  hostSubscriptionPackages,
} from "../completeRegistration/registrationPayment";
import RegistrationPaymentSkeleton from "../completeRegistration/registrationPaymentSkeleton";

type HostPackageModalProps = {
  packageId?: string;
};

export default function HostPackageModal({
  packageId,
}: HostPackageModalProps) {
  return (
    <Suspense fallback={<RegistrationPaymentSkeleton />}>
      <Modal packageId={packageId} />
    </Suspense>
  );
}

const Modal = ({ packageId }: HostPackageModalProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const packageParam = searchParams.get("package");
  const resolvedPackageId = packageId || packageParam;
  const selectedPackage = resolvedPackageId
    ? hostSubscriptionPackages.find((pkg) => pkg.id === resolvedPackageId)
    : undefined;

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("package");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }, [searchParams, router, pathname]);

  if (!packageParam || !selectedPackage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm min-h-screen px-4 py-10"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-[10px] shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <RegistrationPayment package={selectedPackage} />
      </div>
    </div>
  );
};
