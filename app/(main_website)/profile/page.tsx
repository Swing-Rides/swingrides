import GuestProfilePage from "@/components/pages/profilePages/guestProfilePage";
import { testGuestUserProfile } from '@/constants/profile';
import GuestSignInComponent from '@/components/signIn/guestSignInComponent';

export default function ProfilePage() {

        const user = testGuestUserProfile.id || null

        if (!user) {
                return (
                        <div className="w-full min-h-screen flex justify-center items-center py-10">
                                <GuestSignInComponent />
                        </div>
                )
        }

        return (
                <main>
                        <GuestProfilePage 
                                {...testGuestUserProfile}
                        />
                </main>
        )
}
