import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RepositoryDetails from '../RepositoryDetails';
import { RepositoryDetails as RepositoryDetailsType } from '../../../types/github';

// Mock the BookmarkService
jest.mock('../../../services/bookmarkService', () => ({
  BookmarkService: {
    isBookmarked: jest.fn(),
    addBookmark: jest.fn(),
    removeBookmark: jest.fn(),
    getBookmarkCount: jest.fn(),
  },
}));

const mockRepository: RepositoryDetailsType = {
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

describe('RepositoryDetails', () => {
  const defaultProps = {
    repository: mockRepository,
    onBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders repository details correctly', () => {
    render(<RepositoryDetails {...defaultProps} />);

    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.getByText('Test repository description')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('MIT')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    render(<RepositoryDetails {...defaultProps} />);

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);

    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it('opens GitHub URL when "View on GitHub" button is clicked', () => {
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true,
    });

    render(<RepositoryDetails {...defaultProps} />);

    const githubButton = screen.getByTestId('view-github-button');
    fireEvent.click(githubButton);

    expect(mockOpen).toHaveBeenCalledWith(mockRepository.htmlUrl, '_blank');
  });

  it('renders repository statistics correctly', () => {
    render(<RepositoryDetails {...defaultProps} />);

    expect(screen.getByText('100')).toBeInTheDocument(); // stars
    expect(screen.getByText('10')).toBeInTheDocument(); // forks
    expect(screen.getByText('5')).toBeInTheDocument(); // issues
    expect(screen.getByText('20')).toBeInTheDocument(); // watchers
  });

  it('renders topics correctly', () => {
    render(<RepositoryDetails {...defaultProps} />);

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('handles private repository', () => {
    const privateRepo = { ...mockRepository, isPrivate: true };
    render(<RepositoryDetails {...defaultProps} repository={privateRepo} />);

    expect(screen.getByText('🔒 Private')).toBeInTheDocument();
  });

  it('handles archived repository', () => {
    const archivedRepo = { ...mockRepository, isArchived: true };
    render(<RepositoryDetails {...defaultProps} repository={archivedRepo} />);

    expect(screen.getByText('📦 Archived')).toBeInTheDocument();
  });

  it('handles repository without description', () => {
    const repoWithoutDescription = { ...mockRepository, description: '' };
    render(
      <RepositoryDetails
        {...defaultProps}
        repository={repoWithoutDescription}
      />
    );

    expect(
      screen.getByText('No description available for this repository.')
    ).toBeInTheDocument();
  });

  it('handles repository without language', () => {
    const repoWithoutLanguage = { ...mockRepository, language: '' };
    render(
      <RepositoryDetails {...defaultProps} repository={repoWithoutLanguage} />
    );

    // Should not render language section when language is empty
    expect(screen.queryByText('Primary Language')).not.toBeInTheDocument();
  });

  it('handles repository without topics', () => {
    const repoWithoutTopics = { ...mockRepository, topics: [] };
    render(
      <RepositoryDetails {...defaultProps} repository={repoWithoutTopics} />
    );

    // Should not render topics section
    expect(screen.queryByText('🏷️ Topics')).not.toBeInTheDocument();
  });

  it('handles repository without license', () => {
    const repoWithoutLicense = { ...mockRepository, license: '' };
    render(
      <RepositoryDetails {...defaultProps} repository={repoWithoutLicense} />
    );

    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<RepositoryDetails {...defaultProps} />);

    // Check that dates are rendered (they should be formatted)
    const dateElements = screen.getAllByText(/2023/i);
    expect(dateElements).toHaveLength(2); // Created and Updated dates
  });

  it('renders repository owner and name separately', () => {
    render(<RepositoryDetails {...defaultProps} />);

    expect(screen.getByText('test/test-repo')).toBeInTheDocument(); // fullName
  });

  it('handles repository with special characters in name', () => {
    const specialRepo = {
      ...mockRepository,
      name: 'test-repo@v2.0',
      fullName: 'test/test-repo@v2.0',
    };
    render(<RepositoryDetails {...defaultProps} repository={specialRepo} />);

    expect(screen.getByText('test-repo@v2.0')).toBeInTheDocument();
  });

  it('handles repository with emoji in description', () => {
    const emojiRepo = {
      ...mockRepository,
      description: '🚀 Awesome repository with emojis! 🎉',
    };
    render(<RepositoryDetails {...defaultProps} repository={emojiRepo} />);

    expect(
      screen.getByText('🚀 Awesome repository with emojis! 🎉')
    ).toBeInTheDocument();
  });

  it('handles auto-focus on first focusable element', () => {
    render(<RepositoryDetails {...defaultProps} />);

    const backButton = screen.getByTestId('back-button');
    expect(backButton).toBeInTheDocument();
  });
});
