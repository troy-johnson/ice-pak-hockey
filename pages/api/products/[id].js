const productsHandler = async (req, res) => {
   try {
      const headers = new Headers();
      headers.append(
         "Authorization",
         `Basic ${Buffer.from(process.env.PRINTFUL_API_KEY).toString("base64")}`
      );

      const { id } = req.query;

      const result = await fetch(`https://api.printful.com/store/products/${id}`, {
         method: "GET",
         headers: headers,
         redirect: "follow",
      });

      const data = await result.json();

      console.log('productData', data)

      return res.status(200).send(data.result);
   } catch (error) {
      console.log("/api/products GET error", error);
   }
};

export default productsHandler;
