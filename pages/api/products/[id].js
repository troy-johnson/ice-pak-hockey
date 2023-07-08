const productsHandler = async (req, res) => {
   try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${process.env.PRINTFUL_API_KEY}`);

      const { id } = req.query;

      const result = await fetch(`https://api.printful.com/store/products/${id}`, {
         method: "GET",
         headers: headers,
         redirect: "follow",
      });

      const data = await result.json();

      return res.status(200).send(data.result);
   } catch (error) {
      console.log("/api/products GET error", error);
   }
};

export default productsHandler;
