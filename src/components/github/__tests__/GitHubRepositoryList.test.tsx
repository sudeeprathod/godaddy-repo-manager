import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { GitHubApiService } from '../../../services/githubApi';
import { RepositoryDetails } from '../../../types/github';
import GitHubRepositoryList from '../GitHubRepositoryList';

// Mock the GitHub API service
jest.mock('../../../services/githubApi');

const mockGitHubApiService = GitHubApiService as jest.Mocked<
  typeof GitHubApiService
>;

const mockRepositories: RepositoryDetails[] = [
  {
    id: 1,
    name: 'test-repo-1',
    fullName: 'godaddy/test-repo-1',
    description: 'Test repository 1',
    htmlUrl: 'https://github.com/godaddy/test-repo-1',
    language: 'JavaScript',
    stargazersCount: 100,
    forksCount: 50,
    openIssuesCount: 10,
    watchersCount: 20,
    topics: ['test', 'javascript'],
    license: 'MIT',
    isPrivate: false,
    isArchived: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 2,
    name: 'test-repo-2',
    fullName: 'godaddy/test-repo-2',
    description: 'Test repository 2',
    htmlUrl: 'https://github.com/godaddy/test-repo-2',
    language: 'TypeScript',
    stargazersCount: 200,
    forksCount: 75,
    openIssuesCount: 15,
    watchersCount: 25,
    topics: ['test', 'typescript'],
    license: null,
    isPrivate: true,
    isArchived: false,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
  },
  {
    id: 3,
    name: 'test-repo-3',
    fullName: 'godaddy/test-repo-3',
    description: 'Test repository 3',
    htmlUrl: 'https://github.com/godaddy/test-repo-3',
    language: 'Python',
    stargazersCount: 150,
    forksCount: 30,
    openIssuesCount: 5,
    watchersCount: 30,
    topics: ['test', 'python'],
    license: 'Apache-2.0',
    isPrivate: false,
    isArchived: true,
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-06T00:00:00Z',
  },
];

describe('GitHubRepositoryList', () => {
  const mockOnRepositoryClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockGitHubApiService.getGodaddyRepositories.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    expect(
      screen.getByText('Loading GoDaddy repositories...')
    ).toBeInTheDocument();
  });

  it('renders repositories after successful fetch', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    expect(screen.getByText('test-repo-2')).toBeInTheDocument();
    expect(screen.getByText('test-repo-3')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockRejectedValue(
      new Error('API Error')
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Failed to fetch repositories. Please try again later.')
    ).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('filters repositories when search term is entered', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      'Search repositories by name, description, or language...'
    );
    fireEvent.change(searchInput, { target: { value: 'JavaScript' } });

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    expect(screen.queryByText('test-repo-2')).not.toBeInTheDocument();
    expect(screen.queryByText('test-repo-3')).not.toBeInTheDocument();
  });

  it('shows no results when search has no matches', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      'Search repositories by name, description, or language...'
    );
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No repositories found')).toBeInTheDocument();
    });
  });

  it('calls onRepositoryClick when repository card is clicked', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    const viewDetailsButton = screen.getAllByText('View Details')[0];
    fireEvent.click(viewDetailsButton);

    expect(mockOnRepositoryClick).toHaveBeenCalledWith(mockRepositories[0]);
  });

  it('opens GitHub URL when "View on GitHub" button is clicked', async () => {
    // Mock window.open
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true,
    });

    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    const githubButtons = screen.getAllByText('View on GitHub');
    fireEvent.click(githubButtons[0]);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://github.com/godaddy/test-repo-1',
      '_blank'
    );
  });

  it('handles error retry button click', async () => {
    mockGitHubApiService.getGodaddyRepositories
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce(mockRepositories);

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    expect(mockGitHubApiService.getGodaddyRepositories).toHaveBeenCalledTimes(
      2
    );
  });

  it('displays repository statistics correctly', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    // Check if stats are displayed
    expect(screen.getByText('100')).toBeInTheDocument(); // stars
    expect(screen.getByText('50')).toBeInTheDocument(); // forks
    expect(screen.getByText('10')).toBeInTheDocument(); // open issues
  });

  it('displays private badge for private repositories', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-2')).toBeInTheDocument();
    });

    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('displays archived badge for archived repositories', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-3')).toBeInTheDocument();
    });

    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('handles empty repositories array', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue([]);

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('No repositories found')).toBeInTheDocument();
    });
  });

  it('handles repository without description', async () => {
    const reposWithoutDescription = [
      {
        ...mockRepositories[0],
        description: '',
      },
    ];

    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      reposWithoutDescription
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    // Component doesn't show description when it's empty
    expect(
      screen.queryByText('No description available')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Test repository 1')).not.toBeInTheDocument();
  });

  it('handles repository without language', async () => {
    const reposWithoutLanguage = [
      {
        ...mockRepositories[0],
        language: '',
      },
    ];

    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      reposWithoutLanguage
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    // Component doesn't show language badge when language is empty
    expect(screen.queryByText('Not specified')).not.toBeInTheDocument();
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
  });

  it('handles repository without topics', async () => {
    const reposWithoutTopics = [
      {
        ...mockRepositories[0],
        topics: [],
      },
    ];

    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      reposWithoutTopics
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    // Should not display any topic tags
    expect(screen.queryByText('test')).not.toBeInTheDocument();
    expect(screen.queryByText('javascript')).not.toBeInTheDocument();
  });

  it('handles repository without license', async () => {
    const reposWithoutLicense = [
      {
        ...mockRepositories[0],
        license: null,
      },
    ];

    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      reposWithoutLicense
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    // Component doesn't show license information in the list view
    expect(screen.queryByText('Not specified')).not.toBeInTheDocument();
  });

  it('handles intersection observer for infinite scroll', async () => {
    const mockRepos = Array.from({ length: 24 }, (_, i) => ({
      ...mockRepositories[0],
      id: i + 1,
      name: `repo-${i + 1}`,
    }));

    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(mockRepos);

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('repo-1')).toBeInTheDocument();
    });

    // Wait for the loading ref element to appear
    await waitFor(() => {
      expect(screen.getByTestId('loading-more-container')).toBeInTheDocument();
    });

    // Check initial number of cards (should be 12 per page)
    const cards = await screen.findAllByTestId('repository-card');
    expect(cards).toHaveLength(12);

    // Wait for the mock IntersectionObserver instance to be created
    await waitFor(() => {
      expect(
        (
          window as unknown as {
            IntersectionObserver: {
              instances: Array<{
                cb?: (entries: IntersectionObserverEntry[]) => void;
              }>;
            };
          }
        ).IntersectionObserver.instances.length
      ).toBeGreaterThan(0);
    });

    // Check if MockIntersectionObserver is being used
    // eslint-disable-next-line no-console
    console.log(
      'MockIntersectionObserver instances before trigger:',
      (
        window as unknown as {
          IntersectionObserver: {
            instances: Array<{
              cb?: (entries: IntersectionObserverEntry[]) => void;
            }>;
          };
        }
      ).IntersectionObserver.instances.length
    );
    (
      window as unknown as {
        IntersectionObserver: {
          instances: Array<{
            cb?: (entries: IntersectionObserverEntry[]) => void;
          }>;
        };
      }
    ).IntersectionObserver.instances.forEach((instance, index: number) => {
      // eslint-disable-next-line no-console
      console.log(`Instance ${index} callback:`, typeof instance.cb);
    });

    // Simulate intersection observer callback for loading more (first time)
    const observer = (
      window as unknown as {
        IntersectionObserver: {
          instances: Array<{
            cb?: (entries: IntersectionObserverEntry[]) => void;
          }>;
        };
      }
    ).IntersectionObserver.instances[0];
    if (observer && typeof observer.cb === 'function') {
      const loadingElement = screen.getByTestId('loading-more-container');
      await act(async () => {
        observer.cb!([
          {
            isIntersecting: true,
            target: loadingElement,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 1,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: Date.now(),
          } as IntersectionObserverEntry,
        ]);
        await new Promise(resolve => setTimeout(resolve, 800));
      });
    }

    // Simulate intersection observer callback for loading more (second time)
    if (observer && typeof observer.cb === 'function') {
      // Don't query for loading element again, it may be gone
      await act(async () => {
        observer.cb!([
          {
            isIntersecting: true,
            target: document.createElement('div'), // dummy element
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 1,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: Date.now(),
          } as IntersectionObserverEntry,
        ]);
        await new Promise(resolve => setTimeout(resolve, 800));
      });
    }

    // Wait for state updates and check if more cards are loaded
    await waitFor(() => {
      const cards = screen.getAllByTestId('repository-card');
      expect(cards.length).toBeGreaterThan(12);
    });
  });

  it('filters by search term', async () => {
    mockGitHubApiService.getGodaddyRepositories.mockResolvedValue(
      mockRepositories
    );

    render(<GitHubRepositoryList onRepositoryClick={mockOnRepositoryClick} />);

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    // Search by name
    const searchInput = screen.getByPlaceholderText(
      'Search repositories by name, description, or language...'
    );
    fireEvent.change(searchInput, { target: { value: 'test-repo-1' } });

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    expect(screen.queryByText('test-repo-2')).not.toBeInTheDocument();
    expect(screen.queryByText('test-repo-3')).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    expect(screen.getByText('test-repo-2')).toBeInTheDocument();
    expect(screen.getByText('test-repo-3')).toBeInTheDocument();
  });
});
