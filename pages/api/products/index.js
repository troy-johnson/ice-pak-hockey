const productsHandler = async (req, res) => {
   try {
      const headers = new Headers();
      headers.append(
         "Authorization",
         `Basic ${Buffer.from(process.env.PRINTFUL_API_KEY).toString("base64")}`
      );
   
      const result = await fetch("https://api.printful.com/store/products", {
         method: "GET",
         headers: headers,
         redirect: "follow",
      });
   
      const data = await result.json();
   
      let finalProductsList = [];
   
      for await (const product of data.result) {
         const headers = new Headers();
         headers.append(
            "Authorization",
            `Basic ${Buffer.from(process.env.PRINTFUL_API_KEY).toString("base64")}`
         );
   
         const result = await fetch(`https://api.printful.com/store/products/${product.id}`, {
            method: "GET",
            headers: headers,
            redirect: "follow",
         });
   
         const productData = await result.json();
   
         finalProductsList.push(productData.result);
      }
   
      return res.status(200).json(finalProductsList);      
   } catch (error) {
      console.log("/api/products GET error", error)
   }

};

export default productsHandler;
