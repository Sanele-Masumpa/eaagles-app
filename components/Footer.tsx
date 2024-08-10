import { Link } from "@nextui-org/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-300 dark:bg-gray-800 text-gray-400 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Footer Brand */}
          <div className="flex items-center justify-center mb-4 sm:mb-0">
            <Link
              href="https://www.icrdgroup.com"
              isExternal
              className="flex items-center gap-1 text-current"
              title="ICRD Group Holdings landing page"
            >
              <span className="text-default-600">Powered by</span>
              <p className="text-primary font-bold text-lg">ICRD Group Holdings</p>
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 justify-center items-center mb-4 sm:mb-0">
            <Link
              aria-label="Facebook"
              href="https://www.facebook.com/eaglesring"
              isExternal
              className="hover:text-primary transition-colors"
            >
              <FaFacebookF />
            </Link>
            <Link
              aria-label="Twitter"
              href="https://twitter.com/eaglesring"
              isExternal
              className="hover:text-primary transition-colors"
            >
              <FaTwitter />
            </Link>
            <Link
              aria-label="LinkedIn"
              href="https://www.linkedin.com/company/eaglesring"
              isExternal
              className="hover:text-primary transition-colors"
            >
              <FaLinkedinIn />
            </Link>
          </div>

          {/* Footer Links */}
          <div className="flex gap-4 sm:gap-6 justify-center items-center text-xs sm:text-sm">
            <Link
              href="/terms-and-conditions"
              className="hover:text-primary transition-colors"
            >
              <span className="hidden sm:inline">Terms and Conditions</span>
              <span className="sm:hidden">T&apos;s & C&apos;s</span>
            </Link>
            <Link
              href="/faqs"
              className="hover:text-primary transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 text-center text-xs sm:text-sm">
          <p className="text-default-600">
            © {new Date().getFullYear()} Eagles Ring. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
