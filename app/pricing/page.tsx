import { title } from "@/components/primitives";

export default function PricingPage() {
  return (
    <div className="max-w-full px-6 py-8 mx-auto">
      <h1 className={`${title()} text-center mb-8`}>Pricing</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Pricing Plans</h2>
        <p className="text-lg mb-4">
          At Eagles Ring, we offer flexible pricing plans to suit the needs of both entrepreneurs and investors. Our goal is to provide excellent value and support at every stage of your investment journey.
        </p>
        
        <div className="flex flex-wrap gap-6 justify-center">
          {/* Basic Plan */}
          <div className="border rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-2">Basic Plan</h3>
            <p className="text-lg font-bold mb-4">$49/month</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Access to basic pitching tools</li>
              <li>Limited investor interactions</li>
              <li>Email support</li>
            </ul>
            <a href="/sign-up" className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark block text-center">
              Get Started
            </a>
          </div>
          
          {/* Pro Plan */}
          <div className="border rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-lg font-bold mb-4">$99/month</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Advanced pitching tools</li>
              <li>Priority investor interactions</li>
              <li>Phone and email support</li>
              <li>Analytics and reporting</li>
            </ul>
            <a href="/sign-up" className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark block text-center">
              Get Started
            </a>
          </div>
          
          {/* Enterprise Plan */}
          <div className="border rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-2">Enterprise Plan</h3>
            <p className="text-lg font-bold mb-4">Custom Pricing</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Customized pitching tools</li>
              <li>Dedicated investor matchmaking</li>
              <li>24/7 support</li>
              <li>Comprehensive analytics</li>
              <li>Integration with existing systems</li>
            </ul>
            <a href="/contact" className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark block text-center">
              Contact Us
            </a>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Our Pricing Plans?</h2>
        <p className="text-lg mb-4">
          Our pricing plans are designed to provide flexibility and value. Here’s why our plans are the best choice for you:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li className="text-lg">Access to cutting-edge tools and features tailored to your needs.</li>
          <li className="text-lg">Dedicated support to help you maximize your investment opportunities.</li>
          <li className="text-lg">Scalable plans that grow with your business.</li>
          <li className="text-lg">Transparent pricing with no hidden fees.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is included in each plan?</h3>
            <p className="text-lg">
              Each plan includes a set of features designed to meet the needs of different users. The Basic Plan includes essential tools, while the Pro Plan offers advanced features and priority support. The Enterprise Plan provides custom solutions tailored to large organizations.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Can I switch plans later?</h3>
            <p className="text-lg">
              Yes, you can switch between plans at any time. Our team is here to assist you with upgrading or downgrading your plan to better fit your needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Is there a free trial available?</h3>
            <p className="text-lg">
              We offer a free trial for the Basic Plan so you can experience our platform before committing. Contact us for more details on starting your trial.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
        <p className="text-lg mb-4">
          Ready to take your investment journey to the next level? Choose the plan that’s right for you and start experiencing the benefits of Eagles Ring.
        </p>
        <a href="/sign-up" className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark block text-center">
          Sign Up
        </a>
      </section>
    </div>
  );
}