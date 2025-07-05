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

    it('should handle private repository', () => {
      const mockRepo: GitHubRepository = {
        id: 1,
        node_id: 'test-node-id',
        name: 'private-repo',
        full_name: 'godaddy/private-repo',
        private: true,
        owner: {
          login: 'godaddy',
          id: 1,
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/godaddy',
          type: 'Organization',
        },
        html_url: 'https://github.com/godaddy/private-repo',
        description: 'Private repository',
        fork: false,
        url: 'https://api.github.com/repos/godaddy/private-repo',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        pushed_at: '2023-12-01T00:00:00Z',
        language: 'JavaScript',
        size: 500,
        stargazers_count: 0,
        watchers_count: 5,
        forks_count: 0,
        open_issues_count: 2,
        license: null,
        topics: [],
        visibility: 'private',
        archived: false,
        disabled: false,
        default_branch: 'main',
      };

      expect(mockRepo.private).toBe(true);
      expect(mockRepo.visibility).toBe('private');
      expect(mockRepo.stargazers_count).toBe(0);
      expect(mockRepo.forks_count).toBe(0);
    });

    it('should handle forked repository', () => {
      const mockRepo: GitHubRepository = {
        id: 1,
        node_id: 'test-node-id',
        name: 'forked-repo',
        full_name: 'godaddy/forked-repo',
        private: false,
        owner: {
          login: 'godaddy',
          id: 1,
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/godaddy',
          type: 'Organization',
        },
        html_url: 'https://github.com/godaddy/forked-repo',
        description: 'Forked repository',
        fork: true,
        url: 'https://api.github.com/repos/godaddy/forked-repo',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        pushed_at: '2023-12-01T00:00:00Z',
        language: 'Python',
        size: 2000,
        stargazers_count: 50,
        watchers_count: 10,
        forks_count: 5,
        open_issues_count: 3,
        license: {
          key: 'apache-2.0',
          name: 'Apache License 2.0',
          spdx_id: 'Apache-2.0',
          url: 'https://api.github.com/licenses/apache-2.0',
        },
        topics: ['python', 'machine-learning'],
        visibility: 'public',
        archived: false,
        disabled: false,
        default_branch: 'master',
      };

      expect(mockRepo.fork).toBe(true);
      expect(mockRepo.language).toBe('Python');
      expect(mockRepo.license?.name).toBe('Apache License 2.0');
      expect(mockRepo.default_branch).toBe('master');
    });

    it('should handle archived repository', () => {
      const mockRepo: GitHubRepository = {
        id: 1,
        node_id: 'test-node-id',
        name: 'archived-repo',
        full_name: 'godaddy/archived-repo',
        private: false,
        owner: {
          login: 'godaddy',
          id: 1,
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/godaddy',
          type: 'Organization',
        },
        html_url: 'https://github.com/godaddy/archived-repo',
        description: 'Archived repository',
        fork: false,
        url: 'https://api.github.com/repos/godaddy/archived-repo',
        created_at: '2020-01-01T00:00:00Z',
        updated_at: '2022-12-01T00:00:00Z',
        pushed_at: '2022-12-01T00:00:00Z',
        language: 'Java',
        size: 3000,
        stargazers_count: 200,
        watchers_count: 30,
        forks_count: 25,
        open_issues_count: 0,
        license: {
          key: 'gpl-3.0',
          name: 'GNU General Public License v3.0',
          spdx_id: 'GPL-3.0',
          url: 'https://api.github.com/licenses/gpl-3.0',
        },
        topics: ['java', 'spring'],
        visibility: 'public',
        archived: true,
        disabled: false,
        default_branch: 'main',
      };

      expect(mockRepo.archived).toBe(true);
      expect(mockRepo.open_issues_count).toBe(0);
      expect(mockRepo.language).toBe('Java');
    });

    it('should handle disabled repository', () => {
      const mockRepo: GitHubRepository = {
        id: 1,
        node_id: 'test-node-id',
        name: 'disabled-repo',
        full_name: 'godaddy/disabled-repo',
        private: false,
        owner: {
          login: 'godaddy',
          id: 1,
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/godaddy',
          type: 'Organization',
        },
        html_url: 'https://github.com/godaddy/disabled-repo',
        description: 'Disabled repository',
        fork: false,
        url: 'https://api.github.com/repos/godaddy/disabled-repo',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        pushed_at: '2023-12-01T00:00:00Z',
        language: 'Go',
        size: 1500,
        stargazers_count: 75,
        watchers_count: 15,
        forks_count: 8,
        open_issues_count: 5,
        license: {
          key: 'bsd-3-clause',
          name: 'BSD 3-Clause License',
          spdx_id: 'BSD-3-Clause',
          url: 'https://api.github.com/licenses/bsd-3-clause',
        },
        topics: ['go', 'microservices'],
        visibility: 'public',
        archived: false,
        disabled: true,
        default_branch: 'main',
      };

      expect(mockRepo.disabled).toBe(true);
      expect(mockRepo.language).toBe('Go');
      expect(mockRepo.license?.name).toBe('BSD 3-Clause License');
    });

    it('should handle large numbers', () => {
      const mockRepo: GitHubRepository = {
        id: 999999999,
        node_id: 'test-node-id',
        name: 'large-repo',
        full_name: 'godaddy/large-repo',
        private: false,
        owner: {
          login: 'godaddy',
          id: 999999,
          avatar_url: 'https://example.com/avatar.png',
          html_url: 'https://github.com/godaddy',
          type: 'Organization',
        },
        html_url: 'https://github.com/godaddy/large-repo',
        description: 'Large repository',
        fork: false,
        url: 'https://api.github.com/repos/godaddy/large-repo',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        pushed_at: '2023-12-01T00:00:00Z',
        language: 'C++',
        size: 999999,
        stargazers_count: 9999999,
        watchers_count: 999999,
        forks_count: 999999,
        open_issues_count: 99999,
        license: {
          key: 'mit',
          name: 'MIT',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
        },
        topics: ['cpp', 'performance'],
        visibility: 'public',
        archived: false,
        disabled: false,
        default_branch: 'main',
      };

      expect(mockRepo.id).toBe(999999999);
      expect(mockRepo.owner.id).toBe(999999);
      expect(mockRepo.size).toBe(999999);
      expect(mockRepo.stargazers_count).toBe(9999999);
      expect(mockRepo.watchers_count).toBe(999999);
      expect(mockRepo.forks_count).toBe(999999);
      expect(mockRepo.open_issues_count).toBe(99999);
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

    it('should handle empty topics array', () => {
      const mockDetails: RepositoryDetails = {
        id: 1,
        name: 'test-repo',
        fullName: 'godaddy/test-repo',
        description: 'Test repository',
        htmlUrl: 'https://github.com/godaddy/test-repo',
        language: 'TypeScript',
        forksCount: 0,
        openIssuesCount: 0,
        watchersCount: 0,
        stargazersCount: 0,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-12-01T00:00:00Z',
        topics: [],
        isPrivate: false,
        isArchived: false,
        license: 'MIT',
      };

      expect(mockDetails.topics).toEqual([]);
    });

    it('should handle large numbers', () => {
      const mockDetails: RepositoryDetails = {
        id: 999999999,
        name: 'test-repo',
        fullName: 'godaddy/test-repo',
        description: 'Test repository',
        htmlUrl: 'https://github.com/godaddy/test-repo',
        language: 'TypeScript',
        forksCount: 999999,
        openIssuesCount: 99999,
        watchersCount: 999999,
        stargazersCount: 9999999,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-12-01T00:00:00Z',
        topics: ['react'],
        isPrivate: false,
        isArchived: false,
        license: 'MIT',
      };

      expect(mockDetails.id).toBe(999999999);
      expect(mockDetails.forksCount).toBe(999999);
      expect(mockDetails.openIssuesCount).toBe(99999);
      expect(mockDetails.watchersCount).toBe(999999);
      expect(mockDetails.stargazersCount).toBe(9999999);
    });

    it('should handle private repository details', () => {
      const mockDetails: RepositoryDetails = {
        id: 2,
        name: 'private-repo',
        fullName: 'godaddy/private-repo',
        description: 'Private repository',
        htmlUrl: 'https://github.com/godaddy/private-repo',
        language: 'JavaScript',
        forksCount: 0,
        openIssuesCount: 2,
        watchersCount: 5,
        stargazersCount: 0,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-12-01T00:00:00Z',
        topics: [],
        isPrivate: true,
        isArchived: false,
        license: null,
      };

      expect(mockDetails.isPrivate).toBe(true);
      expect(mockDetails.forksCount).toBe(0);
      expect(mockDetails.stargazersCount).toBe(0);
      expect(mockDetails.license).toBeNull();
    });

    it('should handle archived repository details', () => {
      const mockDetails: RepositoryDetails = {
        id: 3,
        name: 'archived-repo',
        fullName: 'godaddy/archived-repo',
        description: 'Archived repository',
        htmlUrl: 'https://github.com/godaddy/archived-repo',
        language: 'Java',
        forksCount: 25,
        openIssuesCount: 0,
        watchersCount: 30,
        stargazersCount: 200,
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2022-12-01T00:00:00Z',
        topics: ['java', 'spring'],
        isPrivate: false,
        isArchived: true,
        license: 'GPL-3.0',
      };

      expect(mockDetails.isArchived).toBe(true);
      expect(mockDetails.openIssuesCount).toBe(0);
      expect(mockDetails.language).toBe('Java');
      expect(mockDetails.license).toBe('GPL-3.0');
    });

    it('should handle repository with many topics', () => {
      const mockDetails: RepositoryDetails = {
        id: 4,
        name: 'multi-topic-repo',
        fullName: 'godaddy/multi-topic-repo',
        description: 'Repository with many topics',
        htmlUrl: 'https://github.com/godaddy/multi-topic-repo',
        language: 'Python',
        forksCount: 15,
        openIssuesCount: 8,
        watchersCount: 20,
        stargazersCount: 150,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-12-01T00:00:00Z',
        topics: [
          'python',
          'machine-learning',
          'ai',
          'data-science',
          'tensorflow',
          'pytorch',
        ],
        isPrivate: false,
        isArchived: false,
        license: 'Apache-2.0',
      };

      expect(mockDetails.topics).toHaveLength(6);
      expect(mockDetails.topics).toContain('python');
      expect(mockDetails.topics).toContain('machine-learning');
      expect(mockDetails.language).toBe('Python');
      expect(mockDetails.license).toBe('Apache-2.0');
    });
  });

  describe('Type compatibility', () => {
    it('should be compatible with API responses', () => {
      const apiResponse = {
        id: 1,
        name: 'test-repo',
        full_name: 'test/test-repo',
        description: 'Test repository',
        html_url: 'https://github.com/test/test-repo',
        language: 'JavaScript',
        forks_count: 10,
        open_issues_count: 5,
        watchers_count: 20,
        stargazers_count: 100,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        topics: ['react', 'typescript'],
        private: false,
        archived: false,
        license: { name: 'MIT' },
      };

      // This should compile without errors
      const repo: RepositoryDetails = {
        id: apiResponse.id,
        name: apiResponse.name,
        fullName: apiResponse.full_name,
        description: apiResponse.description,
        htmlUrl: apiResponse.html_url,
        language: apiResponse.language,
        forksCount: apiResponse.forks_count,
        openIssuesCount: apiResponse.open_issues_count,
        watchersCount: apiResponse.watchers_count,
        stargazersCount: apiResponse.stargazers_count,
        createdAt: apiResponse.created_at,
        updatedAt: apiResponse.updated_at,
        topics: apiResponse.topics,
        isPrivate: apiResponse.private,
        isArchived: apiResponse.archived,
        license: apiResponse.license?.name || null,
      };

      expect(repo.id).toBe(1);
      expect(repo.name).toBe('test-repo');
    });

    it('should handle GitHub API search response', () => {
      const apiSearchResponse = {
        total_count: 100,
        incomplete_results: false,
        items: [],
      };

      // Test that the structure is compatible
      expect(apiSearchResponse.total_count).toBe(100);
      expect(apiSearchResponse.incomplete_results).toBe(false);
      expect(apiSearchResponse.items).toEqual([]);
    });

    it('should handle conversion from GitHubRepository to RepositoryDetails', () => {
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
        description: gitHubRepo.description || '',
        htmlUrl: gitHubRepo.html_url,
        language: gitHubRepo.language || '',
        forksCount: gitHubRepo.forks_count,
        openIssuesCount: gitHubRepo.open_issues_count,
        watchersCount: gitHubRepo.watchers_count,
        stargazersCount: gitHubRepo.stargazers_count,
        createdAt: gitHubRepo.created_at,
        updatedAt: gitHubRepo.updated_at,
        topics: gitHubRepo.topics,
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
