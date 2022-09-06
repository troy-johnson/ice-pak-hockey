import { mutate } from "swr";

const addGame = async (data) => {
   const response = await fetch("/api/games", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });

   mutate("/api/games");

   return response.json();
};

export default addGame;
