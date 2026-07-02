import { HOST_DASHBOARD_PATH } from '@/constants/constant';
import { redirect } from 'next/navigation';

export default function EditVehiclePage() {
        redirect(`${HOST_DASHBOARD_PATH}fleet`);
}