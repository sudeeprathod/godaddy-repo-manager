import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the GitHub components to avoid API calls in tests
jest.mock('./components/github/GitHubRepositoryList', () => {
  return function MockGitHubRepositoryList({
    onRepositoryClick,
  }: {
    onRepositoryClick: (repo: { id: number; name: string }) => void;
  }) {
    return (
      <div data-testid="github-repository-list">
        <button onClick={() => onRepositoryClick({ id: 1, name: 'Test Repo' })}>
          Test Repository
        </button>
      </div>
    );
  };
});

jest.mock('./components/repositoryDetail/RepositoryDetails', () => {
  return function MockRepositoryDetails({
    repository,
    onBack,
  }: {
    repository: { name: string };
    onBack: () => void;
  }) {
    return (
      <div data-testid="repository-details">
        <h1>{repository.name}</h1>
        <button data-testid="back-button" onClick={onBack}>
          Back
        </button>
      </div>
    );
  };
});

test('renders app title in header', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', {
    name: /Godaddy Repo Manager/i,
  });
  expect(titleElement).toBeInTheDocument();
});

test('renders GitHub repository list by default', () => {
  render(<App />);
  const listElement = screen.getByTestId('github-repository-list');
  expect(listElement).toBeInTheDocument();
});

test('shows repository details when repository is clicked', async () => {
  render(<App />);

  // Click on a repository
  const repoButton = screen.getByText('Test Repository');
  fireEvent.click(repoButton);

  // Should show repository details
  await waitFor(() => {
    expect(screen.getByTestId('repository-details')).toBeInTheDocument();
  });
  expect(screen.getByText('Test Repo')).toBeInTheDocument();
});

test('returns to list view when back button is clicked', async () => {
  render(<App />);

  // Click on a repository to show details
  const repoButton = screen.getByText('Test Repository');
  fireEvent.click(repoButton);

  // Wait for details to appear
  await waitFor(() => {
    expect(screen.getByTestId('repository-details')).toBeInTheDocument();
  });

  // Click back button
  const backButton = screen.getByTestId('back-button');
  fireEvent.click(backButton);

  // Should show repository list again
  await waitFor(() => {
    expect(screen.getByTestId('github-repository-list')).toBeInTheDocument();
  });
});
