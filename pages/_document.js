import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from '@emotion/cache';
import { theme } from "../utils";

const createEmotionCache = () => createCache({ key: 'css' })

class MyDocument extends Document {
   render() {
      return (
         <Html>
            <Head>
               <meta content={theme.palette.primary.main} name="theme-color" />
               <link
                  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                  rel="stylesheet"
               />
               <link
                  href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                  rel="stylesheet"
               />
            </Head>
            <body>
               <Main />
               <NextScript />
            </body>
         </Html>
      );
   }
}

MyDocument.getInitialProps = async (ctx) => {
   const originalRenderPage = ctx.renderPage;

   const cache = createEmotionCache();
   const { extractCriticalToChunks } = createEmotionServer(cache);

   ctx.renderPage = () =>
      originalRenderPage({
         enhanceApp: (App) => (props) =>
            <App emotionCache={cache} {...props} />,
      });

   const initialProps = await Document.getInitialProps(ctx);

   const emotionStyles = extractCriticalToChunks(initialProps.html);
   const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
         data-emotion={`${style.key} ${style.ids.join(" ")}`}
         key={style.key}
         // eslint-disable-next-line react/no-danger
         dangerouslySetInnerHTML={{ __html: style.css }}
      />
   ));

   return {
      ...initialProps,

      styles: [
         ...React.Children.toArray(initialProps.styles),
         ...emotionStyleTags,
      ],
   };
};

export default MyDocument;
