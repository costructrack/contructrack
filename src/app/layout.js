import { Inter } from "next/font/google";
import {Providers} from "./providers";
import "../styles/globals.css";

// Configuring the Inter font to use the Latin subset
const inter = Inter({ subsets: ["latin"] });

// Title and description of the application
export const metadata = {
  title: "CribAI App",
  description: "Oportunidades para estudiantes universitarios.",
};

/**
 * RootLayout is the root layout component for the Next.js application.
 * It defines the HTML structure and wraps all page components, providing a consistent layout.
 * The component includes global styles and metadata for the application.
 *
 * @param {object} children - The child components to be rendered within the layout.
 */
export default function RootLayout({ children }) {
  return (
      
            <html lang="es">
                  <body className={inter.className}>
                        <Providers>
                              {children}
                        </Providers>
                  </body>
            </html>
      
  );
}
