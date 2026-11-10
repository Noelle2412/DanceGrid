import ChoreoListing from "@/components/choreolisting/ChoreoListing";
import { Suspense } from "react";

const ProfilePage = () => {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-muted-foreground">Loading choreos...</div>
      }>
      <ChoreoListing />
    </Suspense>
  );
};

export default ProfilePage;
