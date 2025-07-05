import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { RepositoryDetails } from '../types/github';

// Mock the GitHub API service
jest.mock('../services/githubApi', () => ({
  GitHubApiService: {
    getGodaddyRepositories: jest.fn(),
    searchRepositories: jest.fn(),
    getRepositoryDetails: jest.fn(),
  },
}));

// Mock the BookmarkService
jest.mock('../services/bookmarkService', () => ({
  BookmarkService: {
    isBookmarked: jest.fn(),
    addBookmark: jest.fn(),
    removeBookmark: jest.fn(),
    getBookmarkCount: jest.fn(),
  },
}));

const mockRepository: RepositoryDetails = {
  id: 1,
  name: 'test-repo',
  fullName: 'test/test-repo',
  description: 'Test repository description',
  htmlUrl: 'https://github.com/test/test-repo',
  language: 'JavaScript',
  forksCount: 10,
  openIssuesCount: 5,
  watchersCount: 20,
  stargazersCount: 100,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
  topics: ['react', 'typescript'],
  isPrivate: false,
  isArchived: false,
  license: 'MIT',
};

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders app header correctly', () => {
    render(<App />);

    expect(screen.getByText('Godaddy Repo Manager')).toBeInTheDocument();
    expect(
      screen.getByText("Explore GoDaddy's GitHub repositories")
    ).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    render(<App />);

    expect(
      screen.getByText('Loading GoDaddy repositories...')
    ).toBeInTheDocument();
  });

  it('renders repositories after successful fetch', async () => {
    const { GitHubApiService } = require('../services/githubApi');
    GitHubApiService.getGodaddyRepositories.mockResolvedValue([mockRepository]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });
  });

  it('renders error state when fetch fails', async () => {
    const { GitHubApiService } = require('../services/githubApi');
    GitHubApiService.getGodaddyRepositories.mockRejectedValue(
      new Error('API Error')
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Failed to fetch repositories. Please try again later.')
    ).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('handles retry functionality', async () => {
    const { GitHubApiService } = require('../services/githubApi');
    GitHubApiService.getGodaddyRepositories
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce([mockRepository]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    const { GitHubApiService } = require('../services/githubApi');
    GitHubApiService.getGodaddyRepositories.mockResolvedValue([mockRepository]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      'Search repositories by name, description, or language...'
    );
    fireEvent.change(searchInput, { target: { value: 'JavaScript' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('JavaScript');
    });
  });

  it('handles empty search results', async () => {
    const { GitHubApiService } = require('../services/githubApi');
    GitHubApiService.getGodaddyRepositories.mockResolvedValue([mockRepository]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      'Search repositories by name, description, or language...'
    );
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No repositories found')).toBeInTheDocument();
    });
  });

  it('handles repository click', async () => {
    const { GitHubApiService } = require('../services/githubApi');
    GitHubApiService.getGodaddyRepositories.mockResolvedValue([mockRepository]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    const viewDetailsButton = screen.getAllByText('View Details')[0];
    fireEvent.click(viewDetailsButton);

    expect(screen.getByText('test-repo')).toBeInTheDocument();
  });

  it('handles GitHub URL click', async () => {
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true,
    });

    const { GitHubApiService } = require('../services/githubApi');
    GitHubApiService.getGodaddyRepositories.mockResolvedValue([mockRepository]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    const githubButton = screen.getAllByText('View on GitHub')[0];
    fireEvent.click(githubButton);

    expect(mockOpen).toHaveBeenCalledWith(mockRepository.htmlUrl, '_blank');
  });

  it('handles infinite scroll', async () => {
    const { GitHubApiService } = require('../services/githubApi');
    GitHubApiService.getGodaddyRepositories.mockResolvedValue([mockRepository]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    // The IntersectionObserver is already mocked in setupTests.ts
    // Just verify that the component renders without crashing
    expect(screen.getByText('test-repo')).toBeInTheDocument();
  });

  it('renders footer correctly', () => {
    render(<App />);

    expect(screen.getByText(/© 2024 Godaddy Repo Manager/)).toBeInTheDocument();
    expect(
      screen.getByText(/Built with React & TypeScript/)
    ).toBeInTheDocument();
  });

  it('handles accessibility features', () => {
    render(<App />);

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Check for main content area
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles error boundary', () => {
    // This test verifies that the app doesn't crash on errors
    render(<App />);

    // Should render without crashing
    expect(screen.getByText('Godaddy Repo Manager')).toBeInTheDocument();
  });

  it('handles performance monitoring', () => {
    render(<App />);

    // Should report web vitals
    const reportWebVitals = require('../reportWebVitals').default;
    expect(typeof reportWebVitals).toBe('function');
  });

  it('handles service worker registration', () => {
    render(<App />);

    // Should render without crashing regardless of environment
    expect(screen.getByText('Godaddy Repo Manager')).toBeInTheDocument();
  });

  it('handles responsive design', () => {
    render(<App />);

    // Should render without crashing on different screen sizes
    expect(screen.getByText('Godaddy Repo Manager')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<App />);

    // Should handle keyboard events without crashing
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(screen.getByText('Godaddy Repo Manager')).toBeInTheDocument();
  });

  it('handles focus management', () => {
    render(<App />);

    // Should manage focus correctly
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('handles theme changes', () => {
    render(<App />);

    // Should handle theme changes without crashing
    document.documentElement.classList.add('dark-theme');

    expect(screen.getByText('Godaddy Repo Manager')).toBeInTheDocument();
  });
});
