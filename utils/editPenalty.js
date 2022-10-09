import { mutate } from "swr";

const editPenalty = async (data) => {
   console.log("edit penalty", data);
   const response = await fetch(`/api/penalties/${data.penaltyId}`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });

   mutate(`/api/games/${data.gameId}`);

   return response.json();
};

export default editPenalty;
