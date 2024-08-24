import { Link } from "@nextui-org/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-300 dark:bg-gray-800 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Footer Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link
              href="https://www.icrdgroup.com"
              isExternal
              className="flex items-center gap-1 text-current"
              title="ICRD Group Holdings landing page"
            >
              <span className="text-default-600">Powered by</span>
              <p className="text-amber-600 font-bold text-lg">ICRD Group Holdings</p>
            </Link>
            <p className="mt-4 text-sm text-center md:text-left">
              Connecting entrepreneurs with world-class investors to create a brighter future.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col items-center md:items-center">
            <div className="flex flex-wrap justify-center gap-4 text-center">
              <Link
                href="/terms-and-conditions"
                className="hover:text-primary transition-colors"
              >
                <span className="block sm:hidden">T&apos;s &amp; C&apos;s</span>
                <span className="hidden sm:block">Terms & Conditions</span>
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/faqs"
                className="hover:text-primary transition-colors"
              >
                FAQs
              </Link>
              <span className="text-gray-400 hidden md:inline">|</span>
              <Link
                href="/privacy-policy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400 hidden md:inline">|</span>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <span className="text-gray-400 hidden md:inline">|</span>
              <Link
                href="/pricing"
                className="hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <span className="text-gray-400 hidden md:inline">|</span>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-col items-center md:items-end">
            <p className="mb-4 text-sm">Follow Us</p>
            <div className="flex gap-6">
              <Link
                aria-label="Facebook"
                href="https://www.facebook.com/eaglesring"
                isExternal
                className="hover:text-primary transition-colors"
              >
                <FaFacebookF size={20} />
              </Link>
              <Link
                aria-label="Twitter"
                href="https://twitter.com/eaglesring"
                isExternal
                className="hover:text-primary transition-colors"
              >
                <FaTwitter size={20} />
              </Link>
              <Link
                aria-label="LinkedIn"
                href="https://www.linkedin.com/company/eaglesring"
                isExternal
                className="hover:text-primary transition-colors"
              >
                <FaLinkedinIn size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 text-center text-xs sm:text-sm border-t border-gray-400 pt-4">
          <p className="text-default-600">
            © {new Date().getFullYear()} Eagles Ring. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
