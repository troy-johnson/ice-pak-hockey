const editPlayer = async (data) => {
   const response = await fetch(`/api/players/${data.id}`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });

   return response.json();
};

export default editPlayer;
