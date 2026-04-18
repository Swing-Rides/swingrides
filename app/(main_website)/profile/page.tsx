import { redirect } from 'next/navigation'
import GuestProfilePage from "@/components/pages/profilePages/guestProfilePage";
import { testGuestUserProfile } from '@/constants/profile';

export default function ProfilePage() {

        const user = testGuestUserProfile.id || null

        if (!user) {
                redirect('/sign-in')
        }

        return (
                <main>
                        <GuestProfilePage 
                                {...testGuestUserProfile}
                        />
                </main>
        )
}
