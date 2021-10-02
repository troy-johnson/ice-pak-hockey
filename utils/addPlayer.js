const addPlayer = async (data) => {
   const response = await fetch("/api/upsertPlayer", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });

   return response.json();
};

export default addPlayer;