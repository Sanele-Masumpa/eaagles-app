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
     <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "iconButton", 
            logoImageUrl: "/YourLogoDark.png",
          },
          variables: {
            colorText: "#E0E0E0", // Light gray text
            colorPrimary: "#1E90FF", // Dodger blue
            colorBackground: "#000000", // Black background
            colorInputBackground: "#333333", // Dark gray input background
            colorInputText: "#E0E0E0", // Light gray input text
            colorTextOnPrimaryBackground: "#FFFFFF", // White text on blue background
            colorTextSecondary: "#87CEEB", // Light sky blue
            colorDanger: "#FF6347", // Tomato red
            colorWarning: "#FFA500", // Orange
            colorNeutral: "#CCCCCC", // Light gray
            colorSuccess: "#32CD32", // Lime green
            colorShimmer: "#444444" // Dark gray shimmer
          },
          elements: {
            formButtonPrimary: 'bg-blue-600 text-white border border-blue-800 hover:bg-blue-700 hover:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg px-4 py-2 transition duration-300 ease-in-out', // Blue button with smooth transitions
            formButtonSecondary: 'bg-gray-600 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg px-4 py-2 transition duration-300 ease-in-out', // Dark gray secondary button
            formInput: 'border border-gray-500 p-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400', // Dark gray input field
            formLink: 'text-blue-600 hover:underline hover:text-blue-400', // Blue link
            formError: 'text-red-500 font-bold', // Red error text
            formSuccess: 'text-green-500 font-bold', // Green success text
            formLabel: 'text-gray-200 font-medium', // Light gray labels
            formContainer: 'bg-gray-800 p-6 rounded-lg shadow-lg', // Dark background with shadow
            formHeading: 'text-blue-600 text-2xl font-extrabold', // Blue heading
            formFooter: 'text-gray-400 text-sm', // Medium gray footer text
            formRadio: 'text-blue-600 checked:bg-blue-600', // Blue radio buttons
            formCheckbox: 'text-blue-600 checked:bg-blue-600', // Blue checkboxes
            formTooltip: 'bg-gray-700 text-white p-2 rounded-lg shadow-lg', // Dark gray tooltip
            formLoader: 'border-t-4 border-blue-600 border-solid rounded-full w-12 h-12 animate-spin', // Blue loader
          },
        }}
      >
        <head />
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-700 ">
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
