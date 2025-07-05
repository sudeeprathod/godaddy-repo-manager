# 📚 Godaddy Repo Manager

A modern React application that fetches and displays GoDaddy's GitHub repositories using the GitHub API. Built with TypeScript, React, and modern web technologies.

## ✨ Features

- **GitHub API Integration**: Fetches real GoDaddy repositories from GitHub
- **Repository List**: Displays all GoDaddy repositories with key information
- **Repository Details**: Detailed view of individual repositories
- **Search & Filter**: Search repositories by name and filter by programming language
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Modern UI**: Clean, modern interface with smooth animations
- **Type Safety**: Full TypeScript support for better development experience
- **Component Architecture**: Well-structured with generic and feature-specific components
- **Error Handling**: Graceful handling of API errors and loading states

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone git@github.com:sudeeprathod/godaddy-repo-manager.git
cd godaddy-repo-manager
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

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm test -- --coverage --watchAll=false` - Launches the test runner with test coverage
- `npm run lint` - Runs ESLint to check code quality
- `npm run lint:fix` - Fixes ESLint errors automatically
- `npm run format` - Formats code with Prettier
- `npm run format:check` - Checks if code is properly formatted
- `npm run type-check` - Runs TypeScript type checking

## 📁 Project Structure

```
src/
├── components/
│   ├── generic/           # Reusable UI components
│   │   ├── Button.tsx     # Generic button component
│   │   ├── Input.tsx      # Generic input component
│   │   ├── Card.tsx       # Generic card component
│   │   └── __tests__/     # Tests for generic components
│   └── github/            # GitHub-specific components
│       ├── GitHubRepositoryList.tsx
│       ├── RepositoryDetails.tsx
│       └── __tests__/     # Tests for GitHub components
├── services/
│   └── githubService.ts   # GitHub API service
├── types/
│   └── github.ts          # TypeScript types for GitHub API
├── App.tsx               # Main application component
├── App.css              # Main application styles
└── index.tsx            # Application entry point
```

## 🧩 Component Architecture

### Generic Components

The app uses a set of reusable, stateless components:

- **Button**: Configurable button with multiple variants, sizes, and states
- **Input**: Flexible input component with validation and error handling
- **Card**: Versatile card component for displaying content

### GitHub Components

Components specifically designed for GitHub repository management:

- **GitHubRepositoryList**: Displays a list of GoDaddy repositories with search and filter
- **RepositoryDetails**: Shows detailed information about a specific repository

## 🎨 Design System

The app features a consistent design system with:

- **Color Palette**: Modern gradient backgrounds and consistent color usage
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using a modular scale
- **Animations**: Smooth transitions and hover effects
- **Responsive Design**: Mobile-first approach with breakpoints

## 🔌 GitHub API Integration

### API Service

The app uses the GitHub REST API to fetch GoDaddy's repositories:

- **Endpoint**: `https://api.github.com/orgs/godaddy/repos`
- **Authentication**: Public API (no authentication required for public repos)
- **Rate Limiting**: Respects GitHub's API rate limits
- **Error Handling**: Graceful handling of network errors and API failures

### Data Types

TypeScript interfaces for GitHub API responses:

```typescript
interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  private: boolean;
  // ... and more
}
```

## 🧪 Testing

The project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **API Tests**: Test GitHub service functionality
- **Accessibility Tests**: Ensure components are accessible

### Test Coverage

- ✅ Button component tests
- ✅ GitHubRepositoryList component tests
- ✅ RepositoryDetails component tests
- ✅ App component integration tests

## 🔧 Development

### Code Quality

The project enforces high code quality standards:

- **ESLint**: Code linting with strict rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit checks

### Pre-commit Hooks

Before each commit, the following checks run automatically:

1. ESLint checks for code quality
2. Prettier formats the code
3. TypeScript type checking

### Adding New Features

1. Create feature components in the appropriate directory
2. Use generic components for UI elements
3. Write tests for new functionality
4. Update documentation

## 📱 Responsive Design

The app is fully responsive and works on:

- **Desktop**: Full-featured experience with grid layouts
- **Tablet**: Optimized layouts with touch-friendly interactions
- **Mobile**: Stacked layouts with mobile-optimized controls

## 🎯 Key Features Explained

### Repository List

- **Fetch from GitHub**: Automatically loads GoDaddy repositories from GitHub API
- **Search**: Real-time search through repository names and descriptions
- **Language Filter**: Filter repositories by programming language
- **Statistics**: View counts of total, private, public repositories and languages
- **Loading States**: Shows loading indicators while fetching data
- **Error Handling**: Displays error messages if API calls fail

### Repository Details

- **Comprehensive Info**: Shows detailed repository information
- **Metrics**: Displays stars, forks, and open issues
- **Timestamps**: Shows creation and last update dates
- **Direct Links**: Links to repository on GitHub
- **Responsive Layout**: Adapts to different screen sizes

### Search & Filter

- **Real-time Search**: Instant filtering as you type
- **Language Filter**: Dropdown to filter by programming language
- **Clear Filters**: Easy way to reset search and filters
- **Results Count**: Shows number of repositories matching criteria

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Static Hosting

The app can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your repository for automatic deployments
- **GitHub Pages**: Use the `build` folder as the source
- **AWS S3**: Upload the `build` folder to an S3 bucket

## 🔄 Recent Updates

### Version 2.0 - GitHub Integration

- ✅ Integrated GitHub API to fetch real GoDaddy repositories
- ✅ Created GitHubRepositoryList component
- ✅ Created RepositoryDetails component
- ✅ Added TypeScript types for GitHub API
- ✅ Implemented error handling and loading states
- ✅ Updated all tests to pass
- ✅ Fixed ESLint and Prettier configurations
- ✅ Added comprehensive test coverage

### Version 1.0 - Initial Setup

- ✅ Created React app with TypeScript
- ✅ Implemented generic components (Button, Input, Card)
- ✅ Set up testing with Jest and React Testing Library
- ✅ Configured ESLint and Prettier
- ✅ Added Husky pre-commit hooks
- ✅ Created responsive design system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Backend tests in the express directory may fail due to MongoDB connection issues (unrelated to React app)
- Run tests from the `godaddy-repo-manager` directory to avoid backend test failures

## 🎉 Current Status

✅ **React App**: Fully functional and tested  
✅ **GitHub Integration**: Working with real API data  
✅ **All Tests**: Passing  
✅ **Code Quality**: ESLint and Prettier configured  
✅ **Documentation**: Complete and up-to-date

The application is ready for production use and further development!

## 🙏 Acknowledgments

- React team for the amazing framework
- TypeScript team for type safety
- Testing Library for excellent testing utilities
- The open-source community for inspiration and tools

## 📞 Support

If you have any questions or need help:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
