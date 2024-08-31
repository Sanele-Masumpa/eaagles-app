"use client";
import { useState, useEffect } from 'react';
import Loader from "@/components/Loader";

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-full px-6 py-8 mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Privacy Policy</h1>
      <p className="text-lg mb-8 text-center">
        Your privacy is important to us. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully.
      </p>
      
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Table of Contents</h2>
        <ul className="list-none space-y-2">
          <li>
            <a href="#information-we-collect" className="text-blue-600 hover:underline">
              1. Information We Collect
            </a>
          </li>
          <li>
            <a href="#how-we-use-your-information" className="text-blue-600 hover:underline">
              2. How We Use Your Information
            </a>
          </li>
          <li>
            <a href="#sharing-your-information" className="text-blue-600 hover:underline">
              3. Sharing Your Information
            </a>
          </li>
          <li>
            <a href="#security" className="text-blue-600 hover:underline">
              4. Security
            </a>
          </li>
          <li>
            <a href="#your-rights" className="text-blue-600 hover:underline">
              5. Your Rights
            </a>
          </li>
          <li>
            <a href="#changes-to-this-policy" className="text-blue-600 hover:underline">
              6. Changes to This Policy
            </a>
          </li>
          <li>
            <a href="#contact-us" className="text-blue-600 hover:underline">
              7. Contact Us
            </a>
          </li>
          <li>
            <a href="#cookies" className="text-blue-600 hover:underline">
              8. Cookies
            </a>
          </li>
          <li>
            <a href="#third-party-services" className="text-blue-600 hover:underline">
              9. Third-Party Services
            </a>
          </li>
          <li>
            <a href="#data-retention" className="text-blue-600 hover:underline">
              10. Data Retention
            </a>
          </li>
          <li>
            <a href="#international-transfers" className="text-blue-600 hover:underline">
              11. International Transfers
            </a>
          </li>
          <li>
            <a href="#childrens-privacy" className="text-blue-600 hover:underline">
              12. Children's Privacy
            </a>
          </li>
          <li>
            <a href="#user-feedback" className="text-blue-600 hover:underline">
              13. User Feedback
            </a>
          </li>
          <li>
            <a href="#data-breach-notification" className="text-blue-600 hover:underline">
              14. Data Breach Notification
            </a>
          </li>
          <li>
            <a href="#privacy-policy-for-partners" className="text-blue-600 hover:underline">
              15. Privacy Policy for Partners
            </a>
          </li>
          <li>
            <a href="#legal-disclosures" className="text-blue-600 hover:underline">
              16. Legal Disclosures
            </a>
          </li>
          <li>
            <a href="#policy-enforcement" className="text-blue-600 hover:underline">
              17. Policy Enforcement
            </a>
          </li>
          <li>
            <a href="#privacy-policy-for-applications" className="text-blue-600 hover:underline">
              18. Privacy Policy for Applications
            </a>
          </li>
        </ul>
      </div>
      
      <section id="information-we-collect" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p>
          We may collect personal information, including but not limited to your name, email address, and other details you provide while using our service. Additionally, we may collect usage data, IP addresses, and other analytical information to improve our services.
        </p>
      </section>

      <section id="how-we-use-your-information" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p>
          We use your information to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform. We may also use your data to personalize your experience and send promotional content relevant to your interests.
        </p>
      </section>

      <section id="sharing-your-information" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Sharing Your Information</h2>
        <p>
          We do not share your personal information with third parties, except as necessary to provide our services or as required by law. We may share aggregated and anonymized data with partners for research and analysis purposes.
        </p>
      </section>

      <section id="security" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. We continually update our security practices to safeguard your data.
        </p>
      </section>

      <section id="your-rights" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. Please contact us if you wish to exercise these rights, and we will respond promptly to your request.
        </p>
      </section>

      <section id="changes-to-this-policy" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on our website. It is your responsibility to review this policy periodically for any changes.
        </p>
      </section>

      <section id="contact-us" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our practices, please contact us at{' '}
          <a href="mailto:support@eaglesring.com" className="text-blue-600 hover:underline">
            support@eaglesring.com
          </a>.
        </p>
      </section>

      <section id="cookies" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
        <p>
          We use cookies to enhance your experience on our website. Cookies are small data files that are placed on your device. You can manage your cookie preferences through your browser settings.
        </p>
      </section>

      <section id="third-party-services" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
        <p>
          Our service may contain links to third-party websites and services. We are not responsible for the privacy practices or content of these third parties. Please review their privacy policies before providing any personal information.
        </p>
      </section>

      <section id="data-retention" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy or as required by law. When your data is no longer needed, we will securely delete or anonymize it.
        </p>
      </section>

      <section id="international-transfers" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. International Transfers</h2>
        <p>
          Your personal information may be transferred to and processed in countries other than your own. We ensure that any international transfers comply with applicable data protection laws and provide adequate protection for your data.
        </p>
      </section>

      <section id="childrens-privacy" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Children's Privacy</h2>
        <p>
          Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.
        </p>
      </section>

      <section id="user-feedback" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. User Feedback</h2>
        <p>
          We welcome feedback on our privacy practices. Your input helps us improve our services and address any concerns you may have. Please contact us with your feedback or suggestions.
        </p>
      </section>

      <section id="data-breach-notification" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">14. Data Breach Notification</h2>
        <p>
          In the event of a data breach that may impact your personal information, we will notify you promptly and take necessary measures to mitigate the breach and prevent further incidents.
        </p>
      </section>

      <section id="privacy-policy-for-partners" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">15. Privacy Policy for Partners</h2>
        <p>
          If you are a partner or affiliate of our company, please refer to the separate privacy policy for partners for information on how we handle your data.
        </p>
      </section>

      <section id="legal-disclosures" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">16. Legal Disclosures</h2>
        <p>
          We may disclose your personal information if required to do so by law or in response to valid requests by public authorities.
        </p>
      </section>

      <section id="policy-enforcement" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">17. Policy Enforcement</h2>
        <p>
          We take appropriate measures to enforce this privacy policy and ensure compliance with our practices. If you believe that we have not adhered to this policy, please contact us to resolve the issue.
        </p>
      </section>

      <section id="privacy-policy-for-applications" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">18. Privacy Policy for Applications</h2>
        <p>
          This section provides additional privacy practices for applications we offer. Please review this section to understand how your data is handled in relation to our application services.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
