# AG Handloom E-Commerce Website

A modern, full-featured e-commerce platform for handloom products, built with React, TypeScript, and Supabase.

## Features

- **User Authentication**: Secure login, registration, and profile management
- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart & Wishlist**: Add items to cart or save for later
- **Checkout Process**: Streamlined checkout with address management
- **Payment Integration**: Secure payments via Razorpay
- **Order Tracking**: View and track order status
- **Admin Dashboard**: Manage products, orders, and customers
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Backend & Database**: Supabase (Authentication, Storage, Database)
- **Payment Processing**: Razorpay
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account for backend services
- Razorpay account for payment processing (optional for development)

### Installation

1. Clone the repository
```sh
git clone <repository-url>
cd ag-handloom-simplyfied-main
```

2. Install dependencies
```sh
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id (optional for development)
```

4. Start the development server
```sh
npm run dev
# or
yarn dev
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up the following tables in your Supabase database:
   - `profiles` - User profiles
   - `products` - Product catalog
   - `orders` - Order information
   - `order_items` - Items within orders
   - `addresses` - User shipping addresses
   - `wishlist` - User wishlist items

3. Configure authentication providers in the Supabase dashboard
4. Copy your Supabase URL and anon key to your `.env` file

### Razorpay Integration (Optional for Development)

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Generate API keys from the Razorpay dashboard
3. Add your Razorpay key ID to the `.env` file
4. For testing, you can use Razorpay's test mode without setting up real payment processing

## Deployment

This project can be deployed to any static site hosting service:

1. Build the production version
```sh
npm run build
# or
yarn build
```

2. Deploy the contents of the `dist` folder to your hosting provider

## Project Structure

```
src/
├── components/       # UI components
│   ├── ui/           # Base UI components from shadcn/ui
│   ├── auth/         # Authentication components
│   ├── cart/         # Shopping cart components
│   ├── orders/       # Order management components
│   ├── products/     # Product display components
│   ├── profile/      # User profile components
│   └── payment/      # Payment processing components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and API clients
│   ├── api/          # API modules for different entities
│   └── utils.ts      # Utility functions
├── pages/            # Page components for routing
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component with routing
```

## Customization

### Styling

The project uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.ts`.

### Adding New Features

1. Create new components in the appropriate directories
2. Add routes in `App.tsx` if needed
3. Update context providers if your feature requires state management

## Contributing

1. Fork the repository
2. Create a feature branch
```sh
git checkout -b feature/your-feature-name
```
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project was bootstrapped with Vite
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Original project at https://lovable.dev/projects/936d8691-f151-4c7a-8355-a8f09674fae2
