# NovaCraft Inc Billing and Invoice Enterprise System

A comprehensive, modern billing and invoice management system built for enterprise-level operations. This system provides a complete solution for managing customers, services, subscriptions, invoices, and payments with advanced user management and reporting capabilities.

## 🚀 Features

### Core Functionality
- **Customer Management**: Complete customer lifecycle management for both individual and business customers
- **Service Management**: Create and manage services with flexible billing cycles and pricing
- **Subscription Management**: Handle recurring subscriptions with automated billing
- **Invoice Generation**: Professional invoice creation with customizable templates
- **Payment Processing**: Track payments and manage payment statuses
- **Document Management**: Secure storage and management of customer documents

### User Management & Security
- **Role-Based Access Control (RBAC)**: Granular permissions system
- **Multi-Factor Authentication (MFA)**: Enhanced security with 2FA support
- **User Management**: Complete user lifecycle management
- **Permission Management**: Fine-grained permission control
- **Session Management**: Secure token-based authentication

### Reporting & Analytics
- **Financial Reports**: Revenue tracking and financial analytics
- **Customer Analytics**: Customer behavior and engagement insights
- **Invoice Analytics**: Invoice status distribution and trends
- **Payment Analytics**: Payment processing and outstanding amounts
- **Custom Reports**: Flexible reporting capabilities

### Technical Features
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Live data synchronization
- **Search & Filtering**: Advanced search capabilities across all entities
- **Pagination**: Efficient data loading for large datasets
- **Export Capabilities**: PDF generation and data export
- **Audit Trail**: Complete activity logging

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **React Router**: Client-side routing
- **React Query**: Server state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

### Backend Integration
- **RESTful API**: Clean API design
- **JWT Authentication**: Secure token-based auth
- **HTTPS**: Secure communication
- **CORS Support**: Cross-origin resource sharing

### Key Libraries
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui**: Accessible UI primitives
- **lucide-react**: Beautiful icons
- **date-fns**: Date manipulation
- **recharts**: Data visualization
- **sonner**: Toast notifications

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **Git** for version control
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NovacraftBillingUserInterface
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using bun (recommended for faster installation):
```bash
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=https://localhost:7197

# Environment
NODE_ENV=development
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using bun
bun dev
```

The application will be available at `http://localhost:5173`

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Using bun
bun dev              # Start development server
bun run build        # Build for production
bun run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── client-form/     # Customer form components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Other components
├── config/             # Configuration files
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── services/           # API services
└── main.tsx           # Application entry point
```

## 🔐 Authentication & Security

### Login Flow
1. User enters email and password
2. System validates credentials
3. If MFA is enabled, user enters 2FA code
4. JWT tokens are issued for session management

### Role-Based Access Control
- **Admin**: Full system access
- **Manager**: Customer and invoice management
- **User**: Limited access based on assigned permissions

### Security Features
- JWT token authentication
- Refresh token rotation
- MFA support
- Password policies
- Session timeout
- CORS protection

## 👥 User Management

### User Types
- **Individual Users**: Personal accounts
- **Business Users**: Organization accounts
- **System Users**: Internal system accounts

### User Status
- **Active**: Normal access
- **Inactive**: Suspended access
- **Pending**: Awaiting activation
- **Locked**: Temporarily locked

## 🏢 Customer Management

### Customer Types
- **Individual**: Personal customers
- **Business**: Corporate customers

### Customer Information
- Personal/Organization details
- Contact information
- Addresses (Billing, Physical, Shipping)
- Documents and attachments
- Tax information
- Notes and comments

## 💼 Service Management

### Service Features
- **Pricing**: Base price and discounted pricing
- **Billing Cycles**: One-time, monthly, quarterly, semi-annually, annually
- **Categories**: Service categorization
- **Tax Settings**: Taxable/non-taxable services
- **Terms & Conditions**: Service-specific terms

### Service Status
- **Active**: Available for subscription
- **Inactive**: Temporarily unavailable

## 📊 Subscription Management

### Subscription Features
- **Service Assignment**: Link customers to services
- **Billing Cycles**: Automated billing schedules
- **Status Management**: Active, paused, cancelled, expired
- **Renewal**: Automatic and manual renewal options
- **Billing History**: Complete billing records

## 🧾 Invoice Management

### Invoice Features
- **Template System**: Customizable invoice templates
- **PDF Generation**: Professional PDF invoices
- **Email Integration**: Automated invoice delivery
- **Status Tracking**: Draft, sent, paid, overdue, cancelled
- **Payment Integration**: Payment status updates

### Invoice Status
- **Draft**: In preparation
- **Sent**: Delivered to customer
- **Paid**: Payment received
- **Overdue**: Past due date
- **Cancelled**: Invoice cancelled

## 💳 Payment Management

### Payment Features
- **Payment Tracking**: Monitor payment status
- **Payment Methods**: Multiple payment options
- **Payment History**: Complete payment records
- **Outstanding Balances**: Track unpaid amounts

### Payment Status
- **Completed**: Payment successful
- **Pending**: Payment processing
- **Failed**: Payment failed
- **Refunded**: Payment refunded

## 📈 Reporting & Analytics

### Available Reports
- **Revenue Reports**: Total revenue and trends
- **Customer Reports**: Customer growth and engagement
- **Invoice Reports**: Invoice status and volume
- **Payment Reports**: Payment processing analytics
- **Service Reports**: Service performance metrics

### Analytics Features
- **Real-time Data**: Live dashboard updates
- **Trend Analysis**: Historical data trends
- **Performance Metrics**: Key performance indicators
- **Export Options**: PDF and CSV exports

## 🎨 UI/UX Features

### Design System
- **Modern Interface**: Clean, professional design
- **Responsive Layout**: Works on all screen sizes
- **Dark/Light Mode**: Theme support
- **Accessibility**: WCAG compliant components
- **Loading States**: Smooth loading experiences

### User Experience
- **Intuitive Navigation**: Easy-to-use interface
- **Search & Filter**: Quick data access
- **Bulk Operations**: Efficient batch processing
- **Keyboard Shortcuts**: Power user features
- **Toast Notifications**: User feedback

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
VITE_API_URL=https://localhost:7197

# Environment
NODE_ENV=development

# Optional: Custom domain
VITE_CUSTOM_DOMAIN=your-domain.com
```

### API Configuration
The system connects to a .NET backend API with the following endpoints:
- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Customers: `/api/customers/*`
- Services: `/api/services/*`
- Subscriptions: `/api/subscriptions/*`
- Invoices: `/api/invoices/*`
- Payments: `/api/payments/*`
- Reports: `/api/reports/*`

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
1. **Static Hosting**: Deploy to Vercel, Netlify, or similar
2. **Docker**: Containerized deployment
3. **CDN**: Content delivery network deployment

### Environment Setup
Ensure your production environment has:
- HTTPS enabled
- Proper CORS configuration
- Environment variables set
- API backend accessible

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/mfa/verify` - MFA verification

### User Management Endpoints
- `GET /api/users` - Get users list
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Customer Management Endpoints
- `GET /api/customers` - Get customers list
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer


### Code Standards
- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Add documentation for new features

## 📄 License

This project is proprietary software owned by NovaCraft Inc. All rights reserved.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub issues
- **Questions**: Contact the development team

### Common Issues
1. **API Connection**: Ensure backend is running and accessible
2. **Authentication**: Check JWT token validity
3. **CORS Errors**: Verify API CORS configuration
4. **Build Issues**: Clear node_modules and reinstall dependencies

## 🔄 Version History

### Current Version: 1.0.0
- Initial release
- Complete billing system functionality
- User management and RBAC
- Customer and service management
- Invoice and payment processing
- Reporting and analytics

---

**NovaCraft Inc** - Enterprise Billing Solutions
*Built with ❤️ using modern web technologies*
