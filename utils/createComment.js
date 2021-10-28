const createComment = async (data) => {
   console.log("createComment", data);
   const response = await fetch("/api/comment", {
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

export default createComment;
