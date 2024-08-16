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
                              <meta name="google-signin-client_id" content="133850158493-8tpgkkuvnreh5c8ipchrq7p8csqeprq4.apps.googleusercontent.com"/>
                        </Head>
                        <body>
                              <Main />
                              <NextScript />
                        </body>
                        <script src="https://apis.google.com/js/platform.js" async defer></script>
                  </Html>
            );
      }
}

export default MyDocument;
