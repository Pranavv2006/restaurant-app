# 🍽️ Restaurant Management System

A full-stack restaurant management application built with React, Node.js, and PostgreSQL. This system provides comprehensive functionality for both restaurant merchants and customers, featuring restaurant management, menu operations, cart functionality, and order processing.

![Restaurant Database Design](./Database_design/Restaurant_Database_Design.png)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)

## ✨ Features

### 🏪 Merchant Features

- **Restaurant Management**: Create, edit, and delete restaurants
- **Menu Management**: Add, edit, remove menu items with image uploads
- **Profile Management**: Complete merchant profile with authentication
- **Analytics**: Weekly order tracking and revenue insights
- **Multi-restaurant Support**: Manage multiple restaurants per merchant

### 👥 Customer Features

- **Restaurant Discovery**: Browse and search restaurants by location, cuisine
- **Interactive Menu**: View detailed menu items with images and descriptions
- **Smart Cart System**: Add items with quantity controls and real-time updates
- **Profile Management**: Create and edit customer profiles with address management
- **Google Places Integration**: Autocomplete address input with lat/lng coordinates
- **Order Management**: Place orders and view order history

### 🎨 UI/UX Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Mode Support**: Seamless light/dark theme switching
- **Smooth Animations**: Entrance animations, hover effects, and transitions
- **Interactive Components**: Cart counters, modals, toasts, and dropdowns
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **Google Places API** - Address autocomplete functionality

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 🏗️ Architecture

```
restaurant-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── customer/   # Customer-specific components
│   │   │   ├── merchant/   # Merchant-specific components
│   │   │   └── common/     # Shared components
│   │   ├── pages/          # Main page components
│   │   ├── services/       # API service functions
│   │   └── api/            # Axios configuration
│   └── public/             # Static assets
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API route definitions
│   │   ├── middlewares/    # Custom middleware
│   │   └── models/         # Database models
│   ├── prisma/             # Database schema and migrations
│   └── uploads/            # File upload storage
└── Database_design/        # Database design documentation
```

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone https://github.com/Pranavv2006/restaurant-app.git
cd restaurant-app
```

### 2. Backend Setup

```bash
cd server
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your database credentials and JWT secret

# Setup Prisma and database
npx prisma generate
npx prisma db push
npx prisma db seed  # Optional: populate with sample data
```

### 3. Frontend Setup

```bash
cd ../client
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your API endpoints and Google Places API key
```

### 4. Start the Application

```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## 📖 Usage

### For Merchants

1. **Register/Login** as a merchant
2. **Create Restaurant Profile** with details and images
3. **Add Menu Items** with descriptions, prices, and images
4. **Manage Orders** and view analytics
5. **Edit/Update** restaurant and menu information

### For Customers

1. **Browse Restaurants** by location or search
2. **View Menu Items** with detailed information
3. **Add Items to Cart** with quantity controls
4. **Create Customer Profile** with delivery address
5. **Place Orders** and track order history

## 🔗 API Documentation

### Authentication Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Merchant Endpoints

- `GET /merchant/restaurants` - Get merchant restaurants
- `POST /merchant/restaurants` - Create restaurant
- `PUT /merchant/restaurants/:id` - Update restaurant
- `DELETE /merchant/restaurants/:id` - Delete restaurant
- `GET /merchant/menu/:restaurantId` - Get restaurant menu
- `POST /merchant/menu` - Add menu item
- `PUT /merchant/menu/:id` - Update menu item
- `DELETE /merchant/menu/:id` - Delete menu item

### Customer Endpoints

- `GET /customer/restaurants` - Browse restaurants
- `GET /customer/restaurants/:id` - Get restaurant details
- `POST /customer/profile` - Create customer profile
- `PUT /customer/profile` - Update customer profile
- `POST /customer/cart/add` - Add item to cart
- `PUT /customer/cart/update` - Update cart item
- `DELETE /customer/cart/remove/:id` - Remove cart item
- `GET /customer/cart` - Get cart contents

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main entities:

### Core Tables

- **User** - Authentication and user management
- **Merchant** - Merchant profile information
- **Customer** - Customer profile with address details
- **Restaurant** - Restaurant information and location
- **Menu** - Menu items with pricing and categories
- **Cart** - Shopping cart functionality
- **CartItem** - Individual cart items with quantities

### Key Relationships

- User → Merchant/Customer (One-to-One)
- Merchant → Restaurant (One-to-Many)
- Restaurant → Menu (One-to-Many)
- Customer → Cart (One-to-One)
- Cart → CartItem (One-to-Many)

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/restaurant_db"
JWT_SECRET="your-jwt-secret-key"
PORT=3000
```

### Frontend (.env)

```env
VITE_API_BASE_URL="http://localhost:3000"
VITE_GOOGLE_PLACES_API_KEY="your-google-places-api-key"
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📦 Deployment

### Backend Deployment

1. Set up PostgreSQL database on your hosting provider
2. Configure environment variables
3. Run database migrations: `npx prisma db push`
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Write unit tests for new features
- Ensure responsive design compatibility
- Follow the established code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Pranav** - [GitHub Profile](https://github.com/Pranavv2006)

## 🙏 Acknowledgments

- React and Node.js communities for excellent documentation
- Prisma team for the amazing ORM
- Tailwind CSS for the utility-first approach
- Google Places API for location services

---

For questions or support, please open an issue on GitHub or contact the maintainers.
