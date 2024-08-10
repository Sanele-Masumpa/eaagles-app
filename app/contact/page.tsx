import { title } from "@/components/primitives";

export default function ContactPage() {
  return (
    <div className="max-w-full px-6 py-8 mx-auto">
      <h1 className={`${title()} text-center mb-8`}>Contact Us</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-lg mb-4">
          We&rsquo;d love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us.
        </p>

        <form
          action="mailto:support@example.com"
          encType="text/plain"
          method="POST"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium mb-2"
            >
              Name
            </label>
            <input
              className="w-full border border-default-300 rounded-lg px-4 py-2"
              id="name"
              name="name"
              required
              type="text"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium mb-2"
            >
              Email
            </label>
            <input
              className="w-full border border-default-300 rounded-lg px-4 py-2"
              id="email"
              name="email"
              required
              type="email"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-lg font-medium mb-2"
            >
              Message
            </label>
            <textarea
              className="w-full border border-default-300 rounded-lg px-4 py-2"
              id="message"
              name="message"
              required
              rows={6}
            />
          </div>

          <button
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
            type="submit"
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
            <a
              className="text-primary hover:underline"
              href="mailto:support@example.com"
            >
              Email: support@example.com
            </a>
          </li>
          <li className="text-lg">
            <a
              className="text-primary hover:underline"
              href="tel:+1234567890"
            >
              Phone: +1 (234) 567-890
            </a>
          </li>
          <li className="text-lg">
            <a
              className="text-primary hover:underline"
              href="https://maps.google.com/?q=123+Main+St,+Anytown,+USA"
              rel="noopener noreferrer"
              target="_blank"
            >
              Address: 123 Main St, Anytown, USA
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
