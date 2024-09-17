"use client";
import { Link } from "@nextui-org/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useState, useEffect } from "react";

export const Footer = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <footer className="w-full bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400 text-gray-900 dark:text-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 py-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSmallScreen ? (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <Link
                href="https://www.icrdgroup.com"
                isExternal
                className="flex items-center gap-1 text-current"
                title="ICRD Group Holdings landing page"
              >
                <span className="text-amber-700 dark:text-amber-300">Powered by</span>
                <p className="text-amber-700 dark:text-amber-400 font-bold text-xl">ICRD Group Holdings</p>
              </Link>
              <p className="mt-2 text-sm text-center">
                Connecting entrepreneurs with world-class investors to create a brighter future.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <Link href="/contact" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">Contact</Link>
              <Link href="/pricing" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">Pricing</Link>
              <Link href="/faqs" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">FAQs</Link>
              <Link href="/features" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">Features</Link>
            </div>

            <div className="flex gap-4 mb-6">
              <Link aria-label="Facebook" href="https://www.facebook.com/eaglesring" isExternal>
                <FaFacebookF size={24} className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors" />
              </Link>
              <Link aria-label="Twitter" href="https://twitter.com/eaglesring" isExternal>
                <FaTwitter size={24} className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors" />
              </Link>
              <Link aria-label="LinkedIn" href="https://www.linkedin.com/company/eaglesring" isExternal>
                <FaLinkedinIn size={24} className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors" />
              </Link>
              <Link aria-label="Instagram" href="https://www.instagram.com/eaglesring" isExternal>
                <FaInstagram size={24} className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-12">
            <div className="flex flex-col items-start">
              <Link
                href="https://www.icrdgroup.com"
                isExternal
                className="flex items-center gap-1 text-current mb-4"
                title="ICRD Group Holdings landing page"
              >
                <span className="text-amber-400 dark:text-amber-300">Powered by</span>
                <p className="text-amber-500 dark:text-amber-400 font-bold text-xl">ICRD Group Holdings</p>
              </Link>
              <p className="mb-4">
                Connecting entrepreneurs with world-class investors to create a brighter future.
              </p>
            </div>

            <div className="flex flex-col items-start">
              <p className="text-lg font-semibold mb-4">Quick Links</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-gray-300 dark:border-gray-600 pt-4">
                <Link href="/contact" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">Contact</Link>
                <Link href="/pricing" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">Pricing</Link>
                <Link href="/faqs" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">FAQs</Link>
                <Link href="/features" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">Features</Link>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-lg font-semibold mb-2">Follow Us</p>
              <div className="flex gap-4 mb-4">
                <Link aria-label="Facebook" href="https://www.facebook.com/eaglesring" isExternal>
                  <FaFacebookF size={24} className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors" />
                </Link>
                <Link aria-label="Twitter" href="https://twitter.com/eaglesring" isExternal>
                  <FaTwitter size={24} className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors" />
                </Link>
                <Link aria-label="LinkedIn" href="https://www.linkedin.com/company/eaglesring" isExternal>
                  <FaLinkedinIn size={24} className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors" />
                </Link>
                <Link aria-label="Instagram" href="https://www.instagram.com/eaglesring" isExternal>
                  <FaInstagram size={24} className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors" />
                </Link>
              </div>
              <div className="text-gray-800 dark:text-gray-300 text-sm">
                <p>Email: <a href="mailto:support@eaglesring.com" className="text-amber-800 dark:text-amber-300 hover:underline">support@eaglesring.com</a></p>
                <p>Phone: <a href="tel:+1234567890" className="text-amber-800 dark:text-amber-300 hover:underline">+1 (234) 567-890</a></p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-10 text-xs sm:text-sm border-t border-gray-500 dark:border-gray-400 pt-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} Eagles Ring. All rights reserved.
          </p>
          <div className="flex gap-4 text-gray-700 dark:text-gray-300 text-xs">
            <Link href="/privacy-policy" className="hover:text-gray-500 dark:hover:text-gray-500 transition-colors text-gray-800 dark:text-gray-300 text-sm">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-gray-500 dark:hover:text-gray-500 transition-colors text-gray-800 dark:text-gray-300 text-sm">Terms</Link>
            <Link href="/about" className="hover:text-gray-500 dark:hover:text-gray-500 transition-colors text-gray-800 dark:text-gray-300 text-sm">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
