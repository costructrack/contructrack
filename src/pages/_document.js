import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document component to extend the default document structure
 * provided by Next.js. This is useful for setting up <html>, <head>, and <body> tags.
 */
class MyDocument extends Document {
      render() {
            return (
                  <Html lang="es">
                        <Head>
                              <link rel="preconnect" href="https://fonts.googleapis.com" />
                              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                              <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600&display=swap" rel="stylesheet" />
                        </Head>
                        <body>
                              <Main />
                              <NextScript />
                        </body>
                  </Html>
            );
      }
}

export default MyDocument;
