const createCheckoutSession = async (data) => {
   console.log("data", data);

   const fullName = `${data?.user?.firstName} ${data?.user?.lastName}`;

   const response = await fetch(
      `${
         process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://www.icepakhockey.com"
      }/api/checkout/`,
      {
         mode: "cors",
         cache: "no-cache",
         headers: {
            "Content-Type": "application/json",
         },
         method: "POST",
         body: JSON.stringify({
            items: data.cart,
            user: {
               email: data?.user?.email,
               firstName: data?.user?.firstname,
               lastName: data?.user?.lastName,
               fullName,
            },
         }),
      }
   );

   return response.json();
};

export default createCheckoutSession;
