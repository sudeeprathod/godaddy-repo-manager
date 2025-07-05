import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedFilters, { FilterOptions } from '../AdvancedFilters';

const mockFilters: FilterOptions = {
  dateRange: { start: '', end: '' },
  sizeRange: { min: 0, max: 0 },
  topics: [],
  language: '',
  hasIssues: false,
  hasWiki: false,
  isArchived: false,
  isPrivate: false,
};

const mockOnFiltersChange = jest.fn();
const mockAvailableTopics = ['react', 'typescript', 'javascript'];
const mockAvailableLanguages = ['JavaScript', 'TypeScript', 'Python'];

describe('AdvancedFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the expand/collapse button', () => {
    render(
      <AdvancedFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    expect(screen.getByText('▶ Advanced Filters')).toBeInTheDocument();
  });

  it('expands and collapses when button is clicked', () => {
    render(
      <AdvancedFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    const expandButton = screen.getByText('▶ Advanced Filters');

    // Initially collapsed
    expect(screen.queryByText('Date Range')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(expandButton);
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('▼ Advanced Filters')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(expandButton);
    expect(screen.queryByText('Date Range')).not.toBeInTheDocument();
    expect(screen.getByText('▶ Advanced Filters')).toBeInTheDocument();
  });

  it('shows clear all button when filters are active', () => {
    const activeFilters: FilterOptions = {
      ...mockFilters,
      topics: ['react'],
      language: 'JavaScript',
      hasIssues: true,
    };

    render(
      <AdvancedFilters
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('does not show clear all button when no filters are active', () => {
    render(
      <AdvancedFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('clears all filters when clear all button is clicked', () => {
    const activeFilters: FilterOptions = {
      ...mockFilters,
      topics: ['react'],
      language: 'JavaScript',
      hasIssues: true,
    };

    render(
      <AdvancedFilters
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));
    fireEvent.click(screen.getByText('Clear All'));

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      dateRange: { start: '', end: '' },
      sizeRange: { min: 0, max: 0 },
      topics: [],
      language: '',
      hasIssues: false,
      hasWiki: false,
      isArchived: false,
      isPrivate: false,
    });
  });

  it('updates date range filters', () => {
    render(
      <AdvancedFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    const startDateInput = screen.getAllByDisplayValue('')[0];
    const endDateInput = screen.getAllByDisplayValue('')[1];

    fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-12-31' } });

    // Check that both changes were made (separate calls)
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      dateRange: { start: '2023-01-01', end: '' },
    });
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      dateRange: { start: '', end: '2023-12-31' },
    });
  });

  it('updates size range filters', () => {
    render(
      <AdvancedFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    const minSizeInput = screen.getByPlaceholderText('Min Size');
    const maxSizeInput = screen.getByPlaceholderText('Max Size');

    fireEvent.change(minSizeInput, { target: { value: '100' } });
    fireEvent.change(maxSizeInput, { target: { value: '1000' } });

    // Check that both changes were made (separate calls)
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      sizeRange: { min: 100, max: 0 },
    });
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      sizeRange: { min: 0, max: 1000 },
    });
  });

  it('updates language filter', () => {
    render(
      <AdvancedFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    const languageSelect = screen.getByRole('combobox');
    fireEvent.change(languageSelect, { target: { value: 'JavaScript' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      language: 'JavaScript',
    });
  });

  it('adds and removes topics', () => {
    render(
      <AdvancedFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    const topicInput = screen.getByPlaceholderText('Add topic...');
    const addButton = screen.getByText('Add');

    // Add a topic
    fireEvent.change(topicInput, { target: { value: 'react' } });
    fireEvent.click(addButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      topics: ['react'],
    });

    // Clear the input after adding
    expect(topicInput).toHaveValue('');
  });

  it('prevents adding duplicate topics', () => {
    const filtersWithTopic: FilterOptions = {
      ...mockFilters,
      topics: ['react'],
    };

    render(
      <AdvancedFilters
        filters={filtersWithTopic}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    const topicInput = screen.getByPlaceholderText('Add topic...');
    const addButton = screen.getByText('Add');

    // Try to add the same topic again
    fireEvent.change(topicInput, { target: { value: 'react' } });
    fireEvent.click(addButton);

    // Should not call onFiltersChange since it's a duplicate
    expect(mockOnFiltersChange).not.toHaveBeenCalled();
  });

  it('removes topics when remove button is clicked', () => {
    const filtersWithTopic: FilterOptions = {
      ...mockFilters,
      topics: ['react', 'typescript'],
    };

    render(
      <AdvancedFilters
        filters={filtersWithTopic}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    const removeButtons = screen.getAllByText('×');
    fireEvent.click(removeButtons[0]); // Remove 'react'

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      topics: ['typescript'],
    });
  });

  it('updates checkbox filters', () => {
    render(
      <AdvancedFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    const hasIssuesCheckbox = screen.getByLabelText('Has Issues');
    const hasWikiCheckbox = screen.getByLabelText('Has Wiki');

    fireEvent.click(hasIssuesCheckbox);
    fireEvent.click(hasWikiCheckbox);

    // Check that both changes were made (separate calls)
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      hasIssues: true,
    });
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      hasWiki: true,
    });
  });

  it('displays existing topics as tags', () => {
    const filtersWithTopics: FilterOptions = {
      ...mockFilters,
      topics: ['react', 'typescript'],
    };

    render(
      <AdvancedFilters
        filters={filtersWithTopics}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('displays existing filter values', () => {
    const filtersWithValues: FilterOptions = {
      dateRange: { start: '2023-01-01', end: '2023-12-31' },
      sizeRange: { min: 100, max: 1000 },
      topics: ['react'],
      language: 'JavaScript',
      hasIssues: true,
      hasWiki: false,
      isArchived: true,
      isPrivate: false,
    };

    render(
      <AdvancedFilters
        filters={filtersWithValues}
        onFiltersChange={mockOnFiltersChange}
        _availableTopics={mockAvailableTopics}
        availableLanguages={mockAvailableLanguages}
      />
    );

    fireEvent.click(screen.getByText('▶ Advanced Filters'));

    expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023-12-31')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
  });
});
