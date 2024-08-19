🦅 Eagles Ring

Eagles Ring is an exclusive platform designed to connect entrepreneurs with investors. The platform streamlines the pitching process, offering both asynchronous and real-time interaction opportunities between entrepreneurs and investors. Entrepreneurs can submit their business ideas, and investors can browse pitches, provide feedback, and potentially offer investment.
📜 Table of Contents

    Features
    Tech Stack
    Installation
    Environment Variables
    Usage
    Contributing
    License
    Contact

✨ Features

    🛡️ User Authentication & Role Management: Secure login system with role-based access for entrepreneurs and investors.
    📑 Pitch Submission: Entrepreneurs can submit pitches that investors can review.
    💬 Feedback System: Investors provide feedback on pitches, with notifications sent to entrepreneurs.
    🎥 Live Pitch Events: Real-time video pitch sessions, powered by Twilio, for direct investor engagement.
    🔔 Real-Time Notifications: Get instant updates on feedback, investor interest, and more.
    🗂️ Investor Requests: Tailored requests from investors, allowing entrepreneurs to respond to specific needs.

🛠️ Tech Stack

    Frontend: Next.js, React
    Backend: Next.js API Routes
    Authentication: Clerk
    Database: PostgreSQL
    ORM: Prisma
    Real-Time Updates: WebSockets, GetStream
    Video Streaming: Twilio
    UI Components: NextUI, Tailwind CSS

🚀 Installation
Prerequisites

    Node.js v14.x or higher
    PostgreSQL
    npm or yarn

Clone the Repository

bash

git clone https://github.com/your-username/eagles-ring.git
cd eagles-ring

Install Dependencies

bash

npm install
# or
yarn install

Set Up Environment Variables

Create a .env file in the root directory and add the following variables:

env

DATABASE_URL=your_postgresql_database_url
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api_key
CLERK_API_KEY=your_clerk_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
GETSTREAM_API_KEY=your_getstream_api_key

Run the Application

bash

npm run dev
# or
yarn dev

Visit http://localhost:3000 to view the application.
🎨 Usage
User Authentication and Role Assignment

    Users sign up using Clerk, and upon first login, choose their role (entrepreneur or investor).
    The role determines the user’s dashboard and available features.

Pitch Submission & Feedback

    Entrepreneurs submit pitches through a user-friendly interface.
    Investors can browse and filter pitches, providing detailed feedback or expressing interest.

Live Pitch Events

    Entrepreneurs can schedule live pitch events via Twilio.
    Investors can join these sessions, offering real-time feedback and investment decisions.

Real-Time Notifications

    Notifications are pushed instantly using WebSockets and GetStream, ensuring users are always informed of important updates.

💻 UI/UX Enhancements

    Responsive Design: The app is fully responsive, ensuring a seamless experience across all devices.
    Smooth Animations: Subtle animations enhance the user experience, from button hovers to form transitions.
    Dark Mode Support: Toggle between light and dark themes based on your preference.
    Interactive Cards: Engage users with interactive elements like flipping cards and animated icons.

🤝 Contributing

While this project is not currently open to external contributions, suggestions and ideas are welcome. Please feel free to reach out with your feedback.
📄 License

This project is privately licensed. Unauthorized sharing or distribution is prohibited.
📧 Contact

For any inquiries or feedback, please contact:

    Name: Sanele Hlongwane
    Email: sanelehlongwane61@gmail.com
    GitHub: Sanele-Hlongwane

