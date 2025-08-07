# TooSale - Premium Dropshipping Store

A beautiful, Apple-inspired dropshipping website built with React and Tailwind CSS.

## Features

- 🎨 Clean, minimalist design inspired by Apple's aesthetic
- 📱 Fully responsive mobile-first design
- 🛍️ Product catalog with filtering and sorting
- 🔐 Authentication pages (Login/Signup)
- 🎯 Category-based navigation
- ⭐ Product ratings and reviews
- 🛒 Shopping cart functionality (coming soon)
- 💳 Checkout process (coming soon)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Design Philosophy

This website follows Apple's design principles:

- **Simplicity**: Clean, uncluttered layouts with plenty of white space
- **Typography**: SF Pro Display-inspired font stack for optimal readability
- **Color Palette**: Subtle grays with strategic use of Apple Blue (#007AFF)
- **User Experience**: Intuitive navigation and smooth transitions
- **Accessibility**: Proper color contrast and semantic HTML

## Technology Stack

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Design System** - Apple-inspired components and utilities

## Project Structure

```
src/
├── components/
│   ├── Header.jsx       # Main navigation
│   └── Footer.jsx       # Site footer
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Login form
│   ├── Signup.jsx       # Registration form
│   └── Store.jsx        # Product catalog
├── App.js               # Main app component
├── index.js             # App entry point
└── index.css            # Global styles and Tailwind imports
```

## Customization

### Colors
The color palette can be customized in `tailwind.config.js`:
```javascript
colors: {
  'apple-blue': '#007AFF',
  'apple-gray': {
    // Add your custom gray shades
  }
}
```

### Fonts
The font stack is defined in the Tailwind config and can be modified to match your brand.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

