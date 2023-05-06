import { mutate } from "swr";

const deleteSeason = async (data) => {
   console.log("data", data);
   const response = await fetch(`/api/seasons/${data}`, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      headers: {
         "Content-Type": "application/json",
      },
   });

   mutate(`/api/seasons`);

   return response.json();
};

export default deleteSeason;
