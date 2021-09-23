import useSWR from "swr";

const getSeasonSchedule = seasonId => {
   const { data, error } = useSWR(`/api/season-schedule/${seasonId}`);

   return {
      seasonSchedule: data,
      seasonScheduleLoading: !error && !data,
      seasonScheduleError: error,
   };
};

export default getSeasonSchedule;
