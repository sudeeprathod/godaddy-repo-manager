import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RepositoryDetails from '../RepositoryDetails';
import { RepositoryDetails as RepositoryDetailsType } from '../../../types/github';

// Mock the window.open function
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true,
});

describe('RepositoryDetails', () => {
  const mockRepository: RepositoryDetailsType = {
    id: 1,
    name: 'test-repo',
    fullName: 'test-owner/test-repo',
    description: 'A test repository for testing purposes',
    htmlUrl: 'https://github.com/test-owner/test-repo',
    stargazersCount: 100,
    forksCount: 50,
    watchersCount: 25,
    openIssuesCount: 10,
    language: 'TypeScript',
    license: 'MIT',
    isPrivate: false,
    isArchived: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
    topics: ['react', 'typescript', 'testing'],
  };

  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders repository details correctly', () => {
    render(
      <RepositoryDetails repository={mockRepository} onBack={mockOnBack} />
    );

    // Check if repository name is displayed
    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.getByText('test-owner/test-repo')).toBeInTheDocument();

    // Check if description is displayed
    expect(
      screen.getByText('A test repository for testing purposes')
    ).toBeInTheDocument();

    // Check if stats are displayed
    expect(screen.getByText('100')).toBeInTheDocument(); // stars
    expect(screen.getByText('50')).toBeInTheDocument(); // forks
    expect(screen.getByText('25')).toBeInTheDocument(); // watchers
    expect(screen.getByText('10')).toBeInTheDocument(); // open issues

    // Check if language is displayed
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Check if topics are displayed
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    render(
      <RepositoryDetails repository={mockRepository} onBack={mockOnBack} />
    );

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('handles view on GitHub button click', () => {
    render(
      <RepositoryDetails repository={mockRepository} onBack={mockOnBack} />
    );

    const githubButton = screen.getByTestId('view-github-button');
    fireEvent.click(githubButton);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://github.com/test-owner/test-repo',
      '_blank'
    );
  });

  it('displays private badge for private repositories', () => {
    const privateRepo = { ...mockRepository, isPrivate: true };

    render(<RepositoryDetails repository={privateRepo} onBack={mockOnBack} />);

    expect(screen.getByText('🔒 Private')).toBeInTheDocument();
  });

  it('displays archived badge for archived repositories', () => {
    const archivedRepo = { ...mockRepository, isArchived: true };

    render(<RepositoryDetails repository={archivedRepo} onBack={mockOnBack} />);

    expect(screen.getByText('📦 Archived')).toBeInTheDocument();
  });

  it('displays public badge for public repositories', () => {
    render(
      <RepositoryDetails repository={mockRepository} onBack={mockOnBack} />
    );

    expect(screen.getByText('🌐 Public')).toBeInTheDocument();
  });

  it('displays active status for non-archived repositories', () => {
    render(
      <RepositoryDetails repository={mockRepository} onBack={mockOnBack} />
    );

    expect(screen.getByText('✅ Active')).toBeInTheDocument();
  });

  it('handles repository without description', () => {
    const repoWithoutDescription = { ...mockRepository, description: '' };

    render(
      <RepositoryDetails
        repository={repoWithoutDescription}
        onBack={mockOnBack}
      />
    );

    expect(
      screen.getByText('No description available for this repository.')
    ).toBeInTheDocument();
  });

  it('handles repository without language', () => {
    const repoWithoutLanguage = { ...mockRepository, language: '' };

    render(
      <RepositoryDetails repository={repoWithoutLanguage} onBack={mockOnBack} />
    );

    // Should not display language section
    expect(screen.queryByText('Primary Language')).not.toBeInTheDocument();
  });

  it('handles repository without license', () => {
    const repoWithoutLicense = { ...mockRepository, license: null };

    render(
      <RepositoryDetails repository={repoWithoutLicense} onBack={mockOnBack} />
    );

    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('handles repository without topics', () => {
    const repoWithoutTopics = { ...mockRepository, topics: [] };

    render(
      <RepositoryDetails repository={repoWithoutTopics} onBack={mockOnBack} />
    );

    // Should not display topics section
    expect(screen.queryByText('🏷️ Topics')).not.toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(
      <RepositoryDetails repository={mockRepository} onBack={mockOnBack} />
    );

    // Check if dates are formatted and displayed
    expect(screen.getByText(/January 1, 2023/)).toBeInTheDocument();
    expect(screen.getByText(/December 1, 2023/)).toBeInTheDocument();
  });

  it('formats numbers correctly', () => {
    const repoWithLargeNumbers = {
      ...mockRepository,
      stargazersCount: 1234567,
      forksCount: 89012,
      watchersCount: 3456,
      openIssuesCount: 789,
    };

    render(
      <RepositoryDetails
        repository={repoWithLargeNumbers}
        onBack={mockOnBack}
      />
    );

    // Check if large numbers are formatted with commas
    expect(screen.getByText('1,234,567')).toBeInTheDocument(); // stars
    expect(screen.getByText('89,012')).toBeInTheDocument(); // forks
    expect(screen.getByText('3,456')).toBeInTheDocument(); // watchers
    expect(screen.getByText('789')).toBeInTheDocument(); // open issues
  });

  it('displays all section headers', () => {
    render(
      <RepositoryDetails repository={mockRepository} onBack={mockOnBack} />
    );

    expect(screen.getByText('📝 Description')).toBeInTheDocument();
    expect(screen.getByText('📊 Repository Statistics')).toBeInTheDocument();
    expect(screen.getByText('ℹ️ Repository Information')).toBeInTheDocument();
    expect(screen.getByText('🏷️ Topics')).toBeInTheDocument();
  });

  it('displays all stat icons', () => {
    render(
      <RepositoryDetails repository={mockRepository} onBack={mockOnBack} />
    );

    // Check if stat icons are present
    expect(screen.getByText('⭐')).toBeInTheDocument(); // stars
    expect(screen.getByText('🍴')).toBeInTheDocument(); // forks
    expect(screen.getByText('👀')).toBeInTheDocument(); // watchers
    expect(screen.getByText('🐛')).toBeInTheDocument(); // open issues
  });
});
