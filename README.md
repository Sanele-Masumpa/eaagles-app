# 🦅 Eagles Ring

Eagles Ring is an exclusive platform designed to connect ambitious entrepreneurs with discerning investors. Our platform streamlines the pitching process, enabling both asynchronous and real-time interactions between entrepreneurs and investors. Entrepreneurs can submit their innovative business ideas, and investors can browse pitches, provide insightful feedback, and potentially offer investment opportunities.

## 📜 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [🗝️ Environment Variables](#️-environment-variables)
- [🎨 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📧 Contact](#-contact)

<details>
<summary>✨ Features</summary>

- 🛡️ **User Authentication & Role Management:** Secure and streamlined login system with role-based access tailored for both entrepreneurs and investors.
- 📑 **Pitch Submission:** Entrepreneurs can submit detailed business pitches that investors can easily browse and review.
- 💬 **Feedback System:** A robust feedback mechanism where investors provide constructive feedback on pitches, with instant notifications sent to entrepreneurs.
- 🎥 **Live Pitch Events:** Seamlessly integrated real-time video pitch sessions, powered by Twilio, for direct and engaging investor interactions.
- 🔔 **Real-Time Notifications:** Stay informed with instant updates on feedback, investor interest, and pitch status via WebSockets and GetStream.
- 🗂️ **Investor Requests:** Investors can issue tailored requests to entrepreneurs, allowing them to respond directly to specific needs and opportunities.
- 📊 **Detailed Analytics:** Track pitch performance, investor engagement, and feedback trends with advanced analytics tools.
- 🌍 **Global Reach:** Connect with investors from around the world, expanding the reach and potential of every pitch.
- 🔒 **Data Security & Privacy:** Top-tier security measures ensure that all sensitive information is protected.

</details>

<details>
<summary>🛠️ Tech Stack</summary>

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/)
- **Backend:** [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Authentication:** [Clerk](https://clerk.dev/)
- **Database:** [PostgreSQL](https://www.neon.tech/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Real-Time Updates:** [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), [GetStream](https://getstream.io/)
- **Video Streaming:** [Twilio](https://www.twilio.com/)
- **UI Components:** [NextUI](https://nextui.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** [Vercel](https://vercel.com/), [Docker](https://www.docker.com/)

</details>

<details>
<summary>🚀 Installation</summary>

### Prerequisites

- Node.js v14.x or higher
- PostgreSQL
- npm or yarn
- Docker (optional, for containerized deployment)

### Clone the Repository

```bash
git clone https://github.com/Sanele-Masumpa/eaglesring.git
cd eaglesring
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

</details>

<details>
<summary>🗝️ Environment Variables</summary>

Create a `.env` file in the root directory and add the following variables. **Replace the placeholders with your actual secret values.**

```env
# Clerk API Keys
CLERK_WEBHOOK_SECRET=<YOUR_CLERK_WEBHOOK_SECRET>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/select-role

# Stream API Keys
NEXT_PUBLIC_STREAM_API_KEY=<YOUR_STREAM_API_KEY>
STREAM_SECRET_KEY=<YOUR_STREAM_SECRET_KEY>

# Database URL
DATABASE_URL=<YOUR_DATABASE_URL>

# Pusher API Keys
NEXT_PUBLIC_PUSHER_APP_ID=<YOUR_PUSHER_APP_ID>
NEXT_PUBLIC_PUSHER_KEY=<YOUR_PUSHER_KEY>
PUSHER_SECRET=<YOUR_PUSHER_SECRET>
NEXT_PUBLIC_PUSHER_CLUSTER=<YOUR_PUSHER_CLUSTER>

# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
STRIPE_WEBHOOK_SECRET=<YOUR_STRIPE_WEBHOOK_SECRET>

# Stripe Price IDs
NEXT_PUBLIC_BASIC_PLAN_PRICE_ID=<YOUR_BASIC_PLAN_PRICE_ID>
NEXT_PUBLIC_PRO_PLAN_PRICE_ID=<YOUR_PRO_PLAN_PRICE_ID>
NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID=<YOUR_PREMIUM_PLAN_PRICE_ID>
NEXT_PUBLIC_PRO_ANNUAL_PRICE_ID=<YOUR_PRO_ANNUAL_PRICE_ID>
NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID=<YOUR_PREMIUM_ANNUAL_PRICE_ID>

# Application URL
NEXT_PUBLIC_URL=<REPLACE_WITH_YOUR_URL>
```

</details>

<details>
<summary>🎨 Usage</summary>

### User Authentication and Role Assignment

- Users sign up using Clerk, and upon first login, choose their role (entrepreneur or investor).
- The role determines the user’s dashboard and available features.

### Pitch Submission & Feedback

- Entrepreneurs submit pitches through a user-friendly interface.
- Investors can browse and filter pitches, providing detailed feedback or expressing interest.

### Live Pitch Events

- Entrepreneurs can schedule live pitch events via Twilio.
- Investors can join these sessions, offering real-time feedback and investment decisions.

### Real-Time Notifications

- Notifications are pushed instantly using WebSockets and GetStream, ensuring users are always informed of important updates.

### 💻 UI/UX Enhancements

- **Responsive Design:** The app is fully responsive, ensuring a seamless experience across all devices.
- **Smooth Animations:** Subtle animations enhance the user experience, from button hovers to form transitions.
- **Dark Mode Support:** Toggle between light and dark themes based on your preference.
- **Interactive Cards:** Engage users with interactive elements like flipping cards and animated icons.

</details>

<details>
<summary>🤝 Contributing</summary>

While this project is not currently open to external contributions, suggestions and ideas are welcome. Please feel free to reach out with your feedback.

</details>

<details>
<summary>📄 License</summary>

This project is privately licensed. Unauthorized sharing or distribution is prohibited.

</details>

<details>
<summary>📧 Contact</summary>
 
For any inquiries or feedback, please contact:

- **Name:** Sanele Hlongwane
- **Email:** sanelehlongwane61@gmail.com
- **GitHub:** [Sanele-Masumpa](https://github.com/Sanele-Masumpa) and **GitHub:** [Sanele-Hlongwane](https://github.com/Sanele-Masumpa)
- **Phone Number:** +27 60 317 9552

**Explanation:**
- `+27` is the international dialing code for South Africa.
- The number is then grouped into readable segments. 


</details>