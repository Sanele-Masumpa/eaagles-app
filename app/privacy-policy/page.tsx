import React from 'react';
import Image from 'next/image';
import { FaShieldAlt, FaLock, FaUserShield, FaClipboardCheck, FaGlobe } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="p-6 py-24 text-black dark:text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-gold">Privacy Policy</h1>
      <p className="mb-8">
        Your privacy is important to us. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully.
      </p>
      
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-gold">Table of Contents</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="#information-we-collect" className="text-blue-600 dark:text-blue-400 hover:underline">1. Information We Collect</a></li>
          <li><a href="#how-we-use-your-information" className="text-blue-600 dark:text-blue-400 hover:underline">2. How We Use Your Information</a></li>
          <li><a href="#sharing-your-information" className="text-blue-600 dark:text-blue-400 hover:underline">3. Sharing Your Information</a></li>
          <li><a href="#security" className="text-blue-600 dark:text-blue-400 hover:underline">4. Security</a></li>
          <li><a href="#your-rights" className="text-blue-600 dark:text-blue-400 hover:underline">5. Your Rights</a></li>
          <li><a href="#changes-to-this-policy" className="text-blue-600 dark:text-blue-400 hover:underline">6. Changes to This Policy</a></li>
          <li><a href="#contact-us" className="text-blue-600 dark:text-blue-400 hover:underline">7. Contact Us</a></li>
          <li><a href="#cookies" className="text-blue-600 dark:text-blue-400 hover:underline">8. Cookies</a></li>
          <li><a href="#third-party-services" className="text-blue-600 dark:text-blue-400 hover:underline">9. Third-Party Services</a></li>
          <li><a href="#data-retention" className="text-blue-600 dark:text-blue-400 hover:underline">10. Data Retention</a></li>
          <li><a href="#international-transfers" className="text-blue-600 dark:text-blue-400 hover:underline">11. International Transfers</a></li>
          <li><a href="#children's-privacy" className="text-blue-600 dark:text-blue-400 hover:underline">12. Children's Privacy</a></li>
          <li><a href="#user-feedback" className="text-blue-600 dark:text-blue-400 hover:underline">13. User Feedback</a></li>
          <li><a href="#data-breach-notification" className="text-blue-600 dark:text-blue-400 hover:underline">14. Data Breach Notification</a></li>
          <li><a href="#privacy-policy-for-partners" className="text-blue-600 dark:text-blue-400 hover:underline">15. Privacy Policy for Partners</a></li>
          <li><a href="#legal-disclosures" className="text-blue-600 dark:text-blue-400 hover:underline">16. Legal Disclosures</a></li>
          <li><a href="#policy-enforcement" className="text-blue-600 dark:text-blue-400 hover:underline">17. Policy Enforcement</a></li>
          <li><a href="#privacy-policy-for-applications" className="text-blue-600 dark:text-blue-400 hover:underline">18. Privacy Policy for Applications</a></li>
        </ul>
      </div>
      
      <h2 id="information-we-collect" className="text-2xl font-semibold mb-4 text-gold">1. Information We Collect</h2>
      <div className="flex items-center mb-4">
        <FaShieldAlt className="text-gold text-3xl mr-3" />
        <p>
          We may collect personal information, including but not limited to your name, email address, and other details you provide while using our service. Additionally, we may collect usage data, IP addresses, and other analytical information to improve our services.
        </p>
      </div>

      <h2 id="how-we-use-your-information" className="text-2xl font-semibold mb-4 text-gold">2. How We Use Your Information</h2>
      <div className="flex items-center mb-4">
        <FaLock className="text-gold text-3xl mr-3" />
        <p>
          We use your information to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform. We may also use your data to personalize your experience and send promotional content relevant to your interests.
        </p>
      </div>

      <h2 id="sharing-your-information" className="text-2xl font-semibold mb-4 text-gold">3. Sharing Your Information</h2>
      <div className="flex items-center mb-4">
        <FaUserShield className="text-gold text-3xl mr-3" />
        <p>
          We do not share your personal information with third parties, except as necessary to provide our services or as required by law. We may share aggregated and anonymized data with partners for research and analysis purposes.
        </p>
      </div>

      <h2 id="security" className="text-2xl font-semibold mb-4 text-gold">4. Security</h2>
      <div className="flex items-center mb-4">
        <FaLock className="text-gold text-3xl mr-3" />
        <p>
          We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. We continually update our security practices to safeguard your data.
        </p>
      </div>

      <h2 id="your-rights" className="text-2xl font-semibold mb-4 text-gold">5. Your Rights</h2>
      <div className="flex items-center mb-4">
        <FaClipboardCheck className="text-gold text-3xl mr-3" />
        <p>
          You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. Please contact us if you wish to exercise these rights, and we will respond promptly to your request.
        </p>
      </div>

      <h2 id="changes-to-this-policy" className="text-2xl font-semibold mb-4 text-gold">6. Changes to This Policy</h2>
      <div className="flex items-center mb-4">
        <FaClipboardCheck className="text-gold text-3xl mr-3" />
        <p>
          We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on our website. It is your responsibility to review this policy periodically for any changes.
        </p>
      </div>

      <h2 id="contact-us" className="text-2xl font-semibold mb-4 text-gold">7. Contact Us</h2>
      <div className="flex items-center mb-4">
        <FaGlobe className="text-gold text-3xl mr-3" />
        <p>
          If you have any questions about this privacy policy or our practices, please contact us at{' '}
          <a href="mailto:support@eaglesring.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            support@eaglesring.com
          </a>.
        </p>
      </div>

      <h2 id="cookies" className="text-2xl font-semibold mb-4 text-gold">8. Cookies</h2>
      <div className="flex items-center mb-4">
        <FaClipboardCheck className="text-gold text-3xl mr-3" />
        <p>
          We use cookies to enhance your experience on our platform. Cookies help us understand how you interact with our website and provide personalized content. You can manage your cookie preferences through your browser settings.
        </p>
      </div>

      <h2 id="third-party-services" className="text-2xl font-semibold mb-4 text-gold">9. Third-Party Services</h2>
      <div className="flex items-center mb-4">
        <FaGlobe className="text-gold text-3xl mr-3" />
        <p>
          Our platform may contain links to third-party services. We are not responsible for the privacy practices of these services. We encourage you to review their privacy policies before interacting with them.
        </p>
      </div>

      <h2 id="data-retention" className="text-2xl font-semibold mb-4 text-gold">10. Data Retention</h2>
      <div className="flex items-center mb-4">
        <FaLock className="text-gold text-3xl mr-3" />
        <p>
          We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy or as required by law. If you no longer wish to use our services, you can request the deletion of your data.
        </p>
      </div>

      <h2 id="international-transfers" className="text-2xl font-semibold mb-4 text-gold">11. International Transfers</h2>
      <div className="flex items-center mb-4">
        <FaGlobe className="text-gold text-3xl mr-3" />
        <p>
          Your data may be transferred to and processed in countries other than your own. We take measures to ensure that your data is protected in accordance with this privacy policy regardless of where it is processed.
        </p>
      </div>

      <h2 id="children's-privacy" className="text-2xl font-semibold mb-4 text-gold">12. Children's Privacy</h2>
      <div className="flex items-center mb-4">
        <FaShieldAlt className="text-gold text-3xl mr-3" />
        <p>
          Our services are not directed to children under the age of 13. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete such information.
        </p>
      </div>

      <h2 id="user-feedback" className="text-2xl font-semibold mb-4 text-gold">13. User Feedback</h2>
      <div className="flex items-center mb-4">
        <FaClipboardCheck className="text-gold text-3xl mr-3" />
        <p>
          We welcome feedback from our users to improve our services. If you have any suggestions or comments, please contact us. We value your input and strive to enhance your experience with us.
        </p>
      </div>

      <h2 id="data-breach-notification" className="text-2xl font-semibold mb-4 text-gold">14. Data Breach Notification</h2>
      <div className="flex items-center mb-4">
        <FaShieldAlt className="text-gold text-3xl mr-3" />
        <p>
          In the event of a data breach, we will notify affected individuals and relevant authorities as required by law. We will also take appropriate measures to mitigate the impact and prevent future breaches.
        </p>
      </div>

      <h2 id="privacy-policy-for-partners" className="text-2xl font-semibold mb-4 text-gold">15. Privacy Policy for Partners</h2>
      <div className="flex items-center mb-4">
        <FaUserShield className="text-gold text-3xl mr-3" />
        <p>
          Partners who handle personal data on our behalf are required to comply with our privacy policy and data protection standards. We ensure that our partners implement adequate security measures to protect your information.
        </p>
      </div>

      <h2 id="legal-disclosures" className="text-2xl font-semibold mb-4 text-gold">16. Legal Disclosures</h2>
      <div className="flex items-center mb-4">
        <FaShieldAlt className="text-gold text-3xl mr-3" />
        <p>
          We may disclose your information if required to do so by law or in response to legal requests, such as subpoenas or court orders. We may also disclose your data to protect our rights, privacy, safety, or property, or that of others.
        </p>
      </div>

      <h2 id="policy-enforcement" className="text-2xl font-semibold mb-4 text-gold">17. Policy Enforcement</h2>
      <div className="flex items-center mb-4">
        <FaClipboardCheck className="text-gold text-3xl mr-3" />
        <p>
          We take privacy seriously and will enforce this policy. If you believe your privacy rights have been violated, please contact us. We will investigate and take appropriate action to address your concerns.
        </p>
      </div>

      <h2 id="privacy-policy-for-applications" className="text-2xl font-semibold mb-4 text-gold">18. Privacy Policy for Applications</h2>
      <div className="flex items-center mb-4">
        <FaClipboardCheck className="text-gold text-3xl mr-3" />
        <p>
          This privacy policy applies to our applications and any related services. We are committed to protecting your privacy across all platforms and ensuring that your personal information is handled with care.
        </p>
      </div>

      <div className="flex justify-center mt-12 relative">
        <div className="relative w-3/5 h-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center animated-text text-white text-lg">
            <p>© 2024 Eagles Ring.All rights reserved. Unauthorized use is prohibited.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
