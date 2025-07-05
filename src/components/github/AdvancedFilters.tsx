import React, { useState, useCallback } from 'react';
import Button from '../generic/Button';
import Input from '../generic/Input';
import './AdvancedFilters.css';

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  sizeRange: {
    min: number;
    max: number;
  };
  topics: string[];
  language: string;
  hasIssues: boolean;
  hasWiki: boolean;
  isArchived: boolean;
  isPrivate: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  _availableTopics: string[];
  availableLanguages: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  _availableTopics,
  availableLanguages,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTopic, setNewTopic] = useState('');

  const updateFilter = useCallback(
    (key: keyof FilterOptions, value: unknown) => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    },
    [filters, onFiltersChange]
  );

  const addTopic = useCallback(() => {
    if (newTopic.trim() && !filters.topics.includes(newTopic.trim())) {
      updateFilter('topics', [...filters.topics, newTopic.trim()]);
      setNewTopic('');
    }
  }, [newTopic, filters.topics, updateFilter]);

  const removeTopic = useCallback(
    (topic: string) => {
      updateFilter(
        'topics',
        filters.topics.filter(t => t !== topic)
      );
    },
    [filters.topics, updateFilter]
  );

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      dateRange: { start: '', end: '' },
      sizeRange: { min: 0, max: 0 },
      topics: [],
      language: '',
      hasIssues: false,
      hasWiki: false,
      isArchived: false,
      isPrivate: false,
    });
  }, [onFiltersChange]);

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
      return Object.values(value).some(v => v !== '' && v !== 0);
    }
    return value !== '' && value !== false;
  });

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          className="expand-filters-btn"
        >
          {isExpanded ? '▼' : '▶'} Advanced Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="secondary"
            onClick={clearAllFilters}
            className="clear-filters-btn"
          >
            Clear All
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="filters-content">
          <div className="filter-section">
            <h4>Date Range</h4>
            <div className="date-inputs">
              <input
                type="date"
                placeholder="Start Date"
                value={filters.dateRange.start}
                onChange={e =>
                  updateFilter('dateRange', {
                    ...filters.dateRange,
                    start: e.target.value,
                  })
                }
                className="input input--medium input--default"
              />
              <input
                type="date"
                placeholder="End Date"
                value={filters.dateRange.end}
                onChange={e =>
                  updateFilter('dateRange', {
                    ...filters.dateRange,
                    end: e.target.value,
                  })
                }
                className="input input--medium input--default"
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Size Range (KB)</h4>
            <div className="size-inputs">
              <Input
                type="number"
                placeholder="Min Size"
                value={
                  filters.sizeRange.min ? String(filters.sizeRange.min) : ''
                }
                onChange={e =>
                  updateFilter('sizeRange', {
                    ...filters.sizeRange,
                    min: Number(e.target.value),
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max Size"
                value={
                  filters.sizeRange.max ? String(filters.sizeRange.max) : ''
                }
                onChange={e =>
                  updateFilter('sizeRange', {
                    ...filters.sizeRange,
                    max: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Language</h4>
            <select
              value={filters.language}
              onChange={e => updateFilter('language', e.target.value)}
              className="language-select"
            >
              <option value="">All Languages</option>
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Topics</h4>
            <div className="topics-input">
              <Input
                type="text"
                placeholder="Add topic..."
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
              />
              <Button
                variant="primary"
                onClick={addTopic}
                className="add-topic-btn"
              >
                Add
              </Button>
            </div>
            <div className="topics-list">
              {filters.topics.map(topic => (
                <span key={topic} className="topic-tag">
                  {topic}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="remove-topic"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Repository Features</h4>
            <div className="checkbox-filters">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.hasIssues}
                  onChange={e => updateFilter('hasIssues', e.target.checked)}
                />
                Has Issues
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.hasWiki}
                  onChange={e => updateFilter('hasWiki', e.target.checked)}
                />
                Has Wiki
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.isArchived}
                  onChange={e => updateFilter('isArchived', e.target.checked)}
                />
                Archived
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.isPrivate}
                  onChange={e => updateFilter('isPrivate', e.target.checked)}
                />
                Private
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
