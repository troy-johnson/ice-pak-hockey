import { mutate } from "swr";

const deletePenalty = async (data) => {
   const response = await fetch(`/api/penalties/${data.penaltyId}`, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      headers: {
         "Content-Type": "application/json",
      },
   });

   mutate(`/api/games/${data.gameId}`);

   return response.json();
};

export default deletePenalty;
