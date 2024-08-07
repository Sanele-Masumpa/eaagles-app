import { title } from "@/components/primitives";

export default function ContactPage() {
  return (
    <div className="max-w-full px-6 py-8 mx-auto">
      <h1 className={`${title()} text-center mb-8`}>Contact Us</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-lg mb-4">
          We’d love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us.
        </p>

        <form
          action="mailto:support@example.com"
          method="POST"
          encType="text/plain"
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full border border-default-300 rounded-lg px-4 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border border-default-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-lg font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full border border-default-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
          >
            Send Message
          </button>
        </form>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Alternative Contact Methods</h2>
        <p className="text-lg mb-4">
          You can also reach us through our social media channels or by visiting our office.
        </p>
        <ul className="space-y-2">
          <li className="text-lg">
            <a href="mailto:support@example.com" className="text-primary hover:underline">
              Email: support@example.com
            </a>
          </li>
          <li className="text-lg">
            <a href="tel:+1234567890" className="text-primary hover:underline">
              Phone: +1 (234) 567-890
            </a>
          </li>
          <li className="text-lg">
            <a href="https://maps.google.com/?q=123+Main+St,+Anytown,+USA" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Address: 123 Main St, Anytown, USA
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}