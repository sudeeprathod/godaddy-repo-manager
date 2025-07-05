import React, { useState } from 'react';
import { RepositoryDetails } from './types/github';
import GitHubRepositoryList from './components/github/GitHubRepositoryList';
import RepositoryDetailsComponent from './components/repositoryDetail/RepositoryDetails';
import './App.css';

const App: React.FC = () => {
  const [selectedRepository, setSelectedRepository] =
    useState<RepositoryDetails | null>(null);

  const handleRepositoryClick = (repository: RepositoryDetails) => {
    setSelectedRepository(repository);
  };

  const handleBackToList = () => {
    setSelectedRepository(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="app-icon">📚</span>
            Godaddy Repo Manager
          </h1>
          <p className="app-subtitle">
            Explore GoDaddy&apos;s GitHub repositories
          </p>
        </div>
      </header>

      <main className="app-main">
        {selectedRepository ? (
          <RepositoryDetailsComponent
            repository={selectedRepository}
            onBack={handleBackToList}
          />
        ) : (
          <GitHubRepositoryList onRepositoryClick={handleRepositoryClick} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Godaddy Repo Manager. Built with React & TypeScript.</p>
      </footer>
    </div>
  );
};

export default App;
