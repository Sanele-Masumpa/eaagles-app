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

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p>
          We may collect personal information, including but not limited to your name, email address, and other details you provide while using our service. Additionally, we may collect usage data, IP addresses, and other analytical information to improve our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p>
          We use your information to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform. We may also use your data to personalize your experience and send promotional content relevant to your interests.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
        <p>
          We do not share your personal information with third parties, except as necessary to provide our services or as required by law. We may share aggregated and anonymized data with partners for research and analysis purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. We continually update our security practices to safeguard your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. Please contact us if you wish to exercise these rights, and we will respond promptly to your request.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on our website. It is your responsibility to review this policy periodically for any changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our practices, please contact us at{' '}
          <a href="mailto:support@eaglesring.com" className="text-blue-600 hover:underline">
            support@eaglesring.com
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
        <p>
          We use cookies to enhance your experience on our website. Cookies are small data files that are placed on your device. You can manage your cookie preferences through your browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
        <p>
          Our service may contain links to third-party websites and services. We are not responsible for the privacy practices or content of these third parties. Please review their privacy policies before providing any personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy or as required by law. When your data is no longer needed, we will securely delete or anonymize it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">International Transfers</h2>
        <p>
          Your personal information may be transferred to and processed in countries other than your own. We ensure that any international transfers comply with applicable data protection laws and provide adequate protection for your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
        <p>
          Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Feedback</h2>
        <p>
          We welcome feedback on our privacy practices. Your input helps us improve our services and address any concerns you may have. Please contact us with your feedback or suggestions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Breach Notification</h2>
        <p>
          In the event of a data breach that may impact your personal information, we will notify you promptly and take necessary measures to mitigate the breach and prevent further incidents.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy for Partners</h2>
        <p>
          If you are a partner or affiliate of our company, please refer to the separate privacy policy for partners for information on how we handle your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Legal Disclosures</h2>
        <p>
          We may disclose your personal information if required to do so by law or in response to valid requests by public authorities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Policy Enforcement</h2>
        <p>
          We take appropriate measures to enforce this privacy policy and ensure compliance with our practices. If you believe that we have not adhered to this policy, please contact us to resolve the issue.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy for Applications</h2>
        <p>
          This section provides additional privacy practices for applications we offer. Please review this section to understand how your data is handled in relation to our application services.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
