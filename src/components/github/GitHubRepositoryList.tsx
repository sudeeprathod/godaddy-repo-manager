import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RepositoryDetails } from '../../types/github';
import { GitHubApiService } from '../../services/githubApi';
import Card from '../generic/Card';
import Button from '../generic/Button';
import Input from '../generic/Input';
import './GitHubRepositoryList.css';

interface GitHubRepositoryListProps {
  onRepositoryClick: (repository: RepositoryDetails) => void;
}

const ITEMS_PER_PAGE = 12; // Number of repositories to show per page

const GitHubRepositoryList: React.FC<GitHubRepositoryListProps> = ({
  onRepositoryClick,
}) => {
  const [repositories, setRepositories] = useState<RepositoryDetails[]>([]);
  const [filteredRepositories, setFilteredRepositories] = useState<
    RepositoryDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Fetch repositories from GitHub API
  const fetchRepositories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GitHubApiService.getGodaddyRepositories();
      setRepositories(data);
      setFilteredRepositories(data.slice(0, ITEMS_PER_PAGE));
      setHasMore(data.length > ITEMS_PER_PAGE);
    } catch (err) {
      setError('Failed to fetch repositories. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more repositories for pagination
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;

      const newRepositories = repositories.slice(startIndex, endIndex);
      setFilteredRepositories(prev => [...prev, ...newRepositories]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < repositories.length);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading more repositories:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, currentPage, repositories]);

  // Filter repositories based on search term
  const filterRepositories = useCallback(
    (term: string) => {
      if (!term.trim()) {
        setFilteredRepositories(repositories.slice(0, ITEMS_PER_PAGE));
        setCurrentPage(1);
        setHasMore(repositories.length > ITEMS_PER_PAGE);
        return;
      }

      const filtered = repositories.filter(
        repo =>
          repo.name.toLowerCase().includes(term.toLowerCase()) ||
          repo.description?.toLowerCase().includes(term.toLowerCase()) ||
          repo.language?.toLowerCase().includes(term.toLowerCase())
      );

      setFilteredRepositories(filtered.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
      setHasMore(filtered.length > ITEMS_PER_PAGE);
    },
    [repositories]
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);
      filterRepositories(term);
    },
    [filterRepositories]
  );

  // Intersection Observer for infinite scroll
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'IntersectionObserver useEffect called. loadingRef.current:',
      loadingRef.current
    );
    if (!loadingRef.current) return;

    // eslint-disable-next-line no-console
    console.log(
      'Creating IntersectionObserver. Is it our mock?',
      window.IntersectionObserver.name === 'MockIntersectionObserver'
    );
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadingRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadingMore, loadMore]);

  // Initial fetch
  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  if (loading) {
    return (
      <div className="github-repository-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading GoDaddy repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-repository-list">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <Button onClick={fetchRepositories} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="github-repository-list">
      <div className="list-header">
        <div className="search-bar-container">
          <div className="card-header">
            <span className="card-icon">📚</span>
            <h1 className="card-title">GoDaddy GitHub Repositories</h1>
            <p className="card-subtitle">
              Explore and manage GoDaddy&apos;s open source projects
            </p>
          </div>
          <div className="search-container">
            <Input
              type="text"
              placeholder="Search repositories by name, description, or language..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="repositories-grid">
        {filteredRepositories.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No repositories found</h3>
            <p>
              {searchTerm
                ? `No repositories match "${searchTerm}". Try a different search term.`
                : 'No repositories available at the moment.'}
            </p>
            {searchTerm && (
              <Button
                onClick={() =>
                  handleSearchChange({
                    target: { value: '' },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                variant="secondary"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            {filteredRepositories.map(repository => (
              <Card
                key={repository.id}
                className="repository-card"
                data-testid="repository-card"
              >
                <div className="repository-content">
                  <div className="repository-header">
                    <h3 className="repository-name">{repository.name}</h3>
                    <div className="repository-badges">
                      {repository.isPrivate && (
                        <span className="badge private">Private</span>
                      )}
                      {repository.isArchived && (
                        <span className="badge archived">Archived</span>
                      )}
                    </div>
                  </div>

                  {repository.description && (
                    <p className="repository-description">
                      {repository.description}
                    </p>
                  )}

                  <div className="repository-stats">
                    <div className="stat">
                      <span className="stat-icon">⭐</span>
                      <span className="stat-value">
                        {repository.stargazersCount}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">🍴</span>
                      <span className="stat-value">
                        {repository.forksCount}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">🐛</span>
                      <span className="stat-value">
                        {repository.openIssuesCount}
                      </span>
                    </div>
                  </div>

                  <div className="repository-meta">
                    {repository.language && (
                      <div className="language-badge">
                        <span className="language-dot"></span>
                        {repository.language}
                      </div>
                    )}
                    <div className="repository-dates">
                      <span>
                        Updated{' '}
                        {new Date(repository.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="repository-actions">
                  <Button
                    onClick={() => onRepositoryClick(repository)}
                    variant="primary"
                    className="view-details-btn"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => window.open(repository.htmlUrl, '_blank')}
                    variant="secondary"
                    className="github-btn"
                  >
                    View on GitHub
                  </Button>
                </div>
              </Card>
            ))}

            {/* Loading more indicator */}
            {hasMore && (
              <div
                ref={loadingRef}
                className="loading-more-container"
                data-testid="loading-more-container"
              >
                {loadingMore ? (
                  <div className="loading-more">
                    <div className="loading-spinner small"></div>
                    <p>Loading more repositories...</p>
                  </div>
                ) : (
                  <div className="scroll-indicator">
                    <p>Scroll down to load more repositories</p>
                    <div className="scroll-arrow">↓</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubRepositoryList;
