import { mutate } from "swr";

const editGoal = async (data) => {
   console.log("edit goal", data)
   const response = await fetch(`/api/goals/${data.goalId}`, {
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

export default editGoal;
