# Manish Portfolio Website

## Overview

This is a personal portfolio website for Manish, featuring a modern, responsive design with multiple pages showcasing personal information, reviews, and social media presence. The site is built as a static website using vanilla HTML, CSS, and JavaScript with a focus on clean design, smooth animations, and mobile responsiveness.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Multi-Page Application**: Built with vanilla HTML, CSS, and JavaScript
- **Responsive Design**: Mobile-first approach with hamburger navigation for smaller screens
- **Component-Based Styling**: CSS variables for consistent theming and design system
- **Modern CSS Features**: Uses CSS Grid, Flexbox, and custom properties for layout and styling
- **Interactive Elements**: JavaScript-powered navigation, scroll effects, animations, and 3D effects

### Page Structure
- **Home (index.html)**: Landing page with hero section and introduction
- **About (about.html)**: Personal information and background
- **Reviews (reviews.html)**: User feedback and testimonials section
- **Socials (socials.html)**: Social media links and contact information

### Styling System
- **CSS Custom Properties**: Centralized color scheme, spacing, and design tokens
- **Design Tokens**: Consistent use of primary colors (#667eea, #764ba2), gradients, shadows, and border radius
- **Typography**: Inter font family with system font fallbacks
- **Animation System**: Smooth transitions and cubic-bezier easing functions

### JavaScript Functionality
- **Navigation System**: Mobile hamburger menu with animated state transitions
- **Scroll Effects**: Scroll-based animations and interactions
- **Review System**: Interactive review/feedback functionality
- **3D Effects**: Enhanced visual interactions
- **Animation Framework**: Custom animation system for page elements

### Design Patterns
- **Mobile-First Responsive Design**: Ensures optimal experience across all device sizes
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Modular CSS**: Organized styling with clear separation of concerns
- **Semantic HTML**: Proper use of HTML5 semantic elements for accessibility

## External Dependencies

### CDN Dependencies
- **Font Awesome 6.0.0**: Icon library for social media icons and UI elements
- **Google Fonts (Inter)**: Primary typography via system font stack with web font fallback

### Browser APIs
- **DOM API**: For interactive functionality and dynamic content manipulation
- **CSS Custom Properties**: For theming and responsive design variables
- **Intersection Observer**: Likely used for scroll-based animations (referenced in script.js)

### No Backend Dependencies
- Static website with no server-side components
- No database requirements
- No external API integrations
- Self-contained client-side functionality