import { GitHubRepository, RepositoryDetails } from '../github';

describe('GitHub Types', () => {
  describe('GitHubRepository interface', () => {
    it('should have all required properties', () => {
      const mockRepo: GitHubRepository = {
        id: 1,
        node_id: 'test-node-id',
        name: 'test-repo',
        full_name: 'godaddy/test-repo',
        private: false,
        owner: {
          login: 'godaddy',
          id: 1,
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/godaddy',
          type: 'Organization',
        },
        html_url: 'https://github.com/godaddy/test-repo',
        description: 'Test repository',
        fork: false,
        url: 'https://api.github.com/repos/godaddy/test-repo',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        pushed_at: '2023-12-01T00:00:00Z',
        language: 'TypeScript',
        size: 1000,
        stargazers_count: 100,
        watchers_count: 25,
        forks_count: 50,
        open_issues_count: 10,
        license: {
          key: 'mit',
          name: 'MIT',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
        },
        topics: ['react', 'typescript'],
        visibility: 'public',
        archived: false,
        disabled: false,
        default_branch: 'main',
      };

      expect(mockRepo.id).toBe(1);
      expect(mockRepo.name).toBe('test-repo');
      expect(mockRepo.full_name).toBe('godaddy/test-repo');
      expect(mockRepo.private).toBe(false);
      expect(mockRepo.owner.login).toBe('godaddy');
      expect(mockRepo.language).toBe('TypeScript');
      expect(mockRepo.topics).toEqual(['react', 'typescript']);
      expect(mockRepo.license?.name).toBe('MIT');
    });

    it('should handle optional properties', () => {
      const mockRepo: GitHubRepository = {
        id: 1,
        node_id: 'test-node-id',
        name: 'test-repo',
        full_name: 'godaddy/test-repo',
        private: false,
        owner: {
          login: 'godaddy',
          id: 1,
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/godaddy',
          type: 'Organization',
        },
        html_url: 'https://github.com/godaddy/test-repo',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/godaddy/test-repo',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        pushed_at: '2023-12-01T00:00:00Z',
        language: null,
        size: 1000,
        stargazers_count: 100,
        watchers_count: 25,
        forks_count: 50,
        open_issues_count: 10,
        license: null,
        topics: [],
        visibility: 'public',
        archived: false,
        disabled: false,
        default_branch: 'main',
      };

      expect(mockRepo.description).toBeNull();
      expect(mockRepo.language).toBeNull();
      expect(mockRepo.license).toBeNull();
      expect(mockRepo.topics).toEqual([]);
    });
  });

  describe('RepositoryDetails interface', () => {
    it('should have all required properties', () => {
      const mockDetails: RepositoryDetails = {
        id: 1,
        name: 'test-repo',
        fullName: 'godaddy/test-repo',
        description: 'Test repository',
        htmlUrl: 'https://github.com/godaddy/test-repo',
        language: 'TypeScript',
        forksCount: 50,
        openIssuesCount: 10,
        watchersCount: 25,
        stargazersCount: 100,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-12-01T00:00:00Z',
        topics: ['react', 'typescript'],
        isPrivate: false,
        isArchived: false,
        license: 'MIT',
      };

      expect(mockDetails.id).toBe(1);
      expect(mockDetails.name).toBe('test-repo');
      expect(mockDetails.fullName).toBe('godaddy/test-repo');
      expect(mockDetails.description).toBe('Test repository');
      expect(mockDetails.htmlUrl).toBe('https://github.com/godaddy/test-repo');
      expect(mockDetails.language).toBe('TypeScript');
      expect(mockDetails.forksCount).toBe(50);
      expect(mockDetails.openIssuesCount).toBe(10);
      expect(mockDetails.watchersCount).toBe(25);
      expect(mockDetails.stargazersCount).toBe(100);
      expect(mockDetails.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(mockDetails.updatedAt).toBe('2023-12-01T00:00:00Z');
      expect(mockDetails.topics).toEqual(['react', 'typescript']);
      expect(mockDetails.isPrivate).toBe(false);
      expect(mockDetails.isArchived).toBe(false);
      expect(mockDetails.license).toBe('MIT');
    });

    it('should handle optional properties', () => {
      const mockDetails: RepositoryDetails = {
        id: 1,
        name: 'test-repo',
        fullName: 'godaddy/test-repo',
        description: '',
        htmlUrl: 'https://github.com/godaddy/test-repo',
        language: '',
        forksCount: 0,
        openIssuesCount: 0,
        watchersCount: 0,
        stargazersCount: 0,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-12-01T00:00:00Z',
        topics: [],
        isPrivate: true,
        isArchived: true,
        license: null,
      };

      expect(mockDetails.description).toBe('');
      expect(mockDetails.language).toBe('');
      expect(mockDetails.topics).toEqual([]);
      expect(mockDetails.license).toBeNull();
      expect(mockDetails.isPrivate).toBe(true);
      expect(mockDetails.isArchived).toBe(true);
    });
  });

  describe('Type compatibility', () => {
    it('should allow conversion from GitHubRepository to RepositoryDetails', () => {
      const gitHubRepo: GitHubRepository = {
        id: 1,
        node_id: 'test-node-id',
        name: 'test-repo',
        full_name: 'godaddy/test-repo',
        private: false,
        owner: {
          login: 'godaddy',
          id: 1,
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/godaddy',
          type: 'Organization',
        },
        html_url: 'https://github.com/godaddy/test-repo',
        description: 'Test repository',
        fork: false,
        url: 'https://api.github.com/repos/godaddy/test-repo',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        pushed_at: '2023-12-01T00:00:00Z',
        language: 'TypeScript',
        size: 1000,
        stargazers_count: 100,
        watchers_count: 25,
        forks_count: 50,
        open_issues_count: 10,
        license: {
          key: 'mit',
          name: 'MIT',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
        },
        topics: ['react', 'typescript'],
        visibility: 'public',
        archived: false,
        disabled: false,
        default_branch: 'main',
      };

      const repoDetails: RepositoryDetails = {
        id: gitHubRepo.id,
        name: gitHubRepo.name,
        fullName: gitHubRepo.full_name,
        description: gitHubRepo.description || 'No description available',
        htmlUrl: gitHubRepo.html_url,
        language: gitHubRepo.language || 'Not specified',
        forksCount: gitHubRepo.forks_count,
        openIssuesCount: gitHubRepo.open_issues_count,
        watchersCount: gitHubRepo.watchers_count,
        stargazersCount: gitHubRepo.stargazers_count,
        createdAt: gitHubRepo.created_at,
        updatedAt: gitHubRepo.updated_at,
        topics: gitHubRepo.topics || [],
        isPrivate: gitHubRepo.private,
        isArchived: gitHubRepo.archived,
        license: gitHubRepo.license?.name || null,
      };

      expect(repoDetails.id).toBe(gitHubRepo.id);
      expect(repoDetails.name).toBe(gitHubRepo.name);
      expect(repoDetails.fullName).toBe(gitHubRepo.full_name);
      expect(repoDetails.description).toBe(gitHubRepo.description);
      expect(repoDetails.htmlUrl).toBe(gitHubRepo.html_url);
      expect(repoDetails.language).toBe(gitHubRepo.language);
      expect(repoDetails.forksCount).toBe(gitHubRepo.forks_count);
      expect(repoDetails.openIssuesCount).toBe(gitHubRepo.open_issues_count);
      expect(repoDetails.watchersCount).toBe(gitHubRepo.watchers_count);
      expect(repoDetails.stargazersCount).toBe(gitHubRepo.stargazers_count);
      expect(repoDetails.createdAt).toBe(gitHubRepo.created_at);
      expect(repoDetails.updatedAt).toBe(gitHubRepo.updated_at);
      expect(repoDetails.topics).toEqual(gitHubRepo.topics);
      expect(repoDetails.isPrivate).toBe(gitHubRepo.private);
      expect(repoDetails.isArchived).toBe(gitHubRepo.archived);
      expect(repoDetails.license).toBe(gitHubRepo.license?.name);
    });
  });
});
