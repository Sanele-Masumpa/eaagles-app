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
    <footer className="w-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-gray-900 dark:text-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 py-10 border-t-4 border-blue-500 dark:border-blue-300">
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
                <span className="text-amber-400 dark:text-amber-300">Powered by</span>
                <p className="text-amber-500 dark:text-amber-400 font-bold text-xl">ICRD Group Holdings</p>
              </Link>
              <p className="mt-2 text-sm text-center">
                Connecting entrepreneurs with world-class investors to create a brighter future.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <Link href="/terms-and-conditions" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">T&amp;C</Link>
              <Link href="/faqs" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">FAQs</Link>
              <Link href="/contact" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">Contact</Link>
              <Link href="/privacy-policy" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors mb-1">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors mb-1">Contact</Link>
              <Link href="/pricing" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors mb-1">Pricing</Link>
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
              <p className="text-lg font-semibold mb-2">Quick Links</p>
              <Link href="/terms-and-conditions" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors mb-1">Terms & Conditions</Link>
              <Link href="/faqs" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors mb-1">FAQs</Link>
              <Link href="/privacy-policy" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors mb-1">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors mb-1">Contact</Link>
              <Link href="/pricing" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors mb-1">Pricing</Link>
              <Link href="/about" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">About</Link>
              <Link href="/features" className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors">Features</Link>
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
                <p>Email: <a href="mailto:support@eaglesring.com" className="text-amber-400 dark:text-amber-300 hover:underline">support@eaglesring.com</a></p>
                <p>Phone: <a href="tel:+1234567890" className="text-amber-400 dark:text-amber-300 hover:underline">+1 (234) 567-890</a></p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 text-center text-xs sm:text-sm border-t border-gray-500 dark:border-gray-400 pt-4">
          <p className="text-gray-700 dark:text-gray-300">
            © {new Date().getFullYear()} Eagles Ring. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
