import { Suspense } from "react";
import MaintenancePageComponents from "@/components/hostComponents/pages/maintenance/maintenancePageComponents";
import MaintenanceLoading from "@/components/hostComponents/pages/maintenance/maintenanceLoading";

export default function MaintenancePage() {
  return (
    <Suspense fallback={<MaintenanceLoading />}>
      <MaintenancePageComponents />
    </Suspense>
  );
}
