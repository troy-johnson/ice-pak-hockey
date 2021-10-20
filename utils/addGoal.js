import { mutate } from "swr";

const addGoal = async (data) => {
   const response = await fetch("/api/goals", {
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

export default addGoal;
