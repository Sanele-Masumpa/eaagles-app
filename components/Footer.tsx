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
              isExternal
              className="flex items-center gap-1 text-current"
              href="https://www.icrdgroup.com"
              title="ICRD Group Holdings landing page"
            >
              <span className="text-default-600">Powered by</span>
              <p className="text-primary font-bold text-lg">ICRD Group Holdings</p>
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 justify-center items-center mb-4 sm:mb-0">
            <Link
              isExternal
              href="https://www.facebook.com/eaglesring"
              className="hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </Link>
            <Link
              isExternal
              href="https://twitter.com/eaglesring"
              className="hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter />
            </Link>
            <Link
              isExternal
              href="https://www.linkedin.com/company/eaglesring"
              className="hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </Link>
          </div>

          {/* Footer Links */}
          <div className="flex gap-4 sm:gap-6 justify-center items-center text-xs sm:text-sm">
            <Link
              className="hover:text-primary transition-colors"
              href="/terms-and-conditions"
            >
              <span className="hidden sm:inline">Terms and Conditions</span>
              <span className="sm:hidden">T's & C's</span>
            </Link>
            <Link
              className="hover:text-primary transition-colors"
              href="/faqs"
            >
              FAQs
            </Link>
            <Link
              className="hover:text-primary transition-colors"
              href="/privacy-policy"
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
