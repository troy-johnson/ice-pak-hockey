const editGameRoster = async (data) => {
   // console.log("data", data)
   const response = await fetch(`/api/player-status`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
   });

   return response.json();
};

export default editGameRoster;
