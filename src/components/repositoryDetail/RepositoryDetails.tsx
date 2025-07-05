import React from 'react';
import { RepositoryDetails as RepositoryDetailsType } from '../../types/github';
import Card from '../generic/Card';
import Button from '../generic/Button';
import './RepositoryDetails.css';

interface RepositoryDetailsProps {
  repository: RepositoryDetailsType;
  onBack: () => void;
}

const RepositoryDetails: React.FC<RepositoryDetailsProps> = ({
  repository,
  onBack,
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C#': '#178600',
      PHP: '#4F5D95',
      Go: '#00ADD8',
      Rust: '#dea584',
      Ruby: '#701516',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
      Vue: '#2c3e50',
      React: '#61dafb',
      Angular: '#dd0031',
      'Node.js': '#339933',
    };
    return colors[language] || '#6b7280';
  };

  return (
    <div className="repository-details">
      <Card variant="glass" className="details-header">
        <div className="header-content">
          <div className="back-section">
            <Button
              onClick={onBack}
              variant="ghost"
              size="small"
              dataTestId="back-button"
            >
              ← Back to Repositories
            </Button>
          </div>

          <div className="title-section">
            <div className="card-icon">📁</div>
            <h1 className="card-title">{repository.name}</h1>
            <p className="card-subtitle">{repository.fullName}</p>
          </div>

          <div className="action-section">
            <Button
              onClick={() => window.open(repository.htmlUrl, '_blank')}
              variant="primary"
              dataTestId="view-github-button"
            >
              🔗 View on GitHub
            </Button>
          </div>
        </div>
      </Card>

      <div className="details-content">
        <div className="main-info">
          <Card variant="gradient" className="description-card">
            <div className="card-header">
              <h2 className="card-title">📝 Description</h2>
            </div>
            <div className="card-body">
              <p className="description-text">
                {repository.description ||
                  'No description available for this repository.'}
              </p>
            </div>
          </Card>

          <Card variant="gradient" className="stats-card">
            <div className="card-header">
              <h2 className="card-title">📊 Repository Statistics</h2>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">⭐</div>
                  <span className="stat-label">Stars</span>
                  <span className="stat-value">
                    {formatNumber(repository.stargazersCount)}
                  </span>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🍴</div>
                  <span className="stat-label">Forks</span>
                  <span className="stat-value">
                    {formatNumber(repository.forksCount)}
                  </span>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">👀</div>
                  <span className="stat-label">Watchers</span>
                  <span className="stat-value">
                    {formatNumber(repository.watchersCount)}
                  </span>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🐛</div>
                  <span className="stat-label">Open Issues</span>
                  <span className="stat-value">
                    {formatNumber(repository.openIssuesCount)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="side-info">
          <Card variant="glass" className="info-card">
            <div className="card-header">
              <h2 className="card-title">ℹ️ Repository Information</h2>
            </div>
            <div className="card-body">
              <div className="info-list">
                {repository.language && (
                  <div className="info-item">
                    <span className="info-label">Primary Language</span>
                    <div className="info-value">
                      <span
                        className="language-dot"
                        style={{
                          backgroundColor: getLanguageColor(
                            repository.language
                          ),
                        }}
                      ></span>
                      <span>{repository.language}</span>
                    </div>
                  </div>
                )}

                <div className="info-item">
                  <span className="info-label">License</span>
                  <span className="info-value">
                    {repository.license || 'Not specified'}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Visibility</span>
                  <span className="info-value">
                    {repository.isPrivate ? '🔒 Private' : '🌐 Public'}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className="info-value">
                    {repository.isArchived ? '📦 Archived' : '✅ Active'}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Created</span>
                  <span className="info-value">
                    {formatDate(repository.createdAt)}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Last Updated</span>
                  <span className="info-value">
                    {formatDate(repository.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {repository.topics && repository.topics.length > 0 && (
            <Card variant="glass" className="topics-card">
              <div className="card-header">
                <h2 className="card-title">🏷️ Topics</h2>
              </div>
              <div className="card-body">
                <div className="topics-list">
                  {repository.topics.map(topic => (
                    <span key={topic} className="topic-tag">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryDetails;
