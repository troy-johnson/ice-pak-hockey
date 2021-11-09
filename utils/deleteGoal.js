import { mutate } from "swr";

const deleteGoal = async (data) => {
   const response = await fetch(`/api/goals/${data.goalId}`, {
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

export default deleteGoal;
