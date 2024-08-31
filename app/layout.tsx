import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/Eagle.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <ClerkProvider>
        <head />
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="flex flex-col min-h-screen dark:bg-gray-900">
              <Navbar />
              <main className="flex-grow w-full py-8">
                <div className="container mx-auto  px-4 sm:px-6 lg:px-8">
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    pauseOnFocusLoss
                  />
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
