import useSWR from "swr";
import { useSession } from "next-auth/client";

const useGetProfile = () => {
   const [session, loading] = useSession();

   const { data, error } = useSWR(`/api/profile/${session?.user?.sub}`);

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
