import useSWR from "swr";
import { useSession } from "next-auth/react";

const useGetProfile = () => {
   const { data: session, status } = useSession()
   const loading = status === "loading"

   const { data, error } = useSWR(`/api/profile/${session?.user?.sub}`);

   console.log('data', data)

   const profile = {
      email: data?.preferredEmail ?? data?.email,
      phone: data?.preferredPhone ?? data?.phoneNumber,
      playerId: data?.id,
      name: `${data?.firstName} ${data?.lastName}`,
   };

   return {
      profile,
      profileLoading: !error && !data,
      profileError: error,
   };
};

export default useGetProfile;
