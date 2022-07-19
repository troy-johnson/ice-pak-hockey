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
   
   
      // let finalProductsList = [];
   
      // for await (const product of data.result) {
      //    const headers = new Headers();
      //    headers.append(
      //       "Authorization",
      //       `Basic ${Buffer.from(process.env.PRINTFUL_API_KEY).toString("base64")}`
      //    );
   
      //    const result = await fetch(`https://api.printful.com/store/products/${product.id}`, {
      //       method: "GET",
      //       headers: headers,
      //       redirect: "follow",
      //    });
   
      //    const productData = await result.json();
   
      //    finalProductsList.push(productData.result);
      // }

      // console.log("fPL", finalProductList)

      const data = await result.json();

      console.log("new data", data)
   
      return res.status(200).send(data.result);      
   } catch (error) {
      console.log("/api/products GET error", error)
   }

};

export default productsHandler;
