import { mutate } from "swr";

const addPenalty = async (data) => {
   console.log("add penalty", data);
   const response = await fetch("/api/penalties", {
      method: "POST",
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

export default addPenalty;
