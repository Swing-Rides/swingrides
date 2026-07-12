import HostVerifyAccount from "@/components/hostComponents/completeRegistration/hostVerifyAccount";


export default function page() {
  return (
    <div>
      <HostVerifyAccount 
        activePlan='flex'
        planFee='$99/month'
        fleetSize='1 vehicle'
        userIsVerified={false}
      />
    </div>
  );
}
