🏡 Airbnb Clone – React Project

A feature-rich Airbnb Clone built with React that replicates the core functionality and design patterns of Airbnb.
This project demonstrates my ability to build scalable, user-friendly web applications with modern frontend tools and best practices.

🚀 Features

1. 🔑 Authentication Flow – signup/login simulation
2. 🏠 Property Listings – dynamic cards with images, pricing, and property details
3. 🔍 Search & Filters – filter listings by location, dates, guests, and price range
4. 📅 Date Picker – intuitive booking calendar
5. ❤️ Wishlist – add/remove properties from favorites
6. 📌 Map Integration (optional: Google Maps / Mapbox)
7. 📱 Responsive Design – optimized for desktop, tablet, and mobile
8. ⚡ Performance Optimizations – React hooks, lazy loading, and code splitting

🛠️ Tech Stack

1. Frontend: React, React Router
2. State Management: Context API / Redux (depending on setup)
3. Styling: Tailwind CSS / Styled Components
4. APIs & Data: REST APIs / Firebase / JSON Server (mock backend)
5. Utilities: Axios / Fetch for API calls, ESLint + Prettier for code quality

📂 Project Structure
src/
 ┣ components/   # Reusable UI components (Navbar, Card, Modal, etc.)
 ┣ pages/        # Page-level components (Home, Search, Booking, Wishlist)
 ┣ context/      # Global state providers
 ┣ hooks/        # Custom React hooks
 ┣ utils/        # Helper functions
 ┣ App.js        # Root app component
 ┗ index.js      # Entry point

⚙️ Getting Started
Clone the repository
1. git clone https://github.com/your-username/airbnb-clone.git
2. cd airbnb-clone

Environment Variables
3. Create a .env file in the root directory.
4. Copy the contents of .env and replace the placeholders with your actual credentials.

Example .env:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/airbnb-clone
PORT=3000

Install dependencies
5. npm install

Start the development server
6. npm start
7. Visit http://localhost:5173
 🎉

🔮 Future Improvements

- 🔗 Payment integration (Stripe/PayPal)
- 💬 Messaging between hosts & guests
- 🌍 Multi-language support (i18n)
- Server-Side Rendering (Next.js) for SEO

🙌 Acknowledgements

Inspired by the original Airbnb platform.
Built with ❤️ using React.
