import { GitHubApiService } from '../githubApi';
import { GitHubRepository } from '../../types/github';

// Mock fetch globally
global.fetch = jest.fn();

describe('GitHubApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGodaddyRepositories', () => {
    it('fetches repositories successfully', async () => {
      const mockResponse: GitHubRepository[] = [
        {
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
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await GitHubApiService.getGodaddyRepositories();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/orgs/godaddy/repos?per_page=100&sort=updated'
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
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
      });
    });

    it('handles API error response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

      await expect(GitHubApiService.getGodaddyRepositories()).rejects.toThrow(
        'GitHub API error: 403 Forbidden'
      );
    });

    it('handles network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(GitHubApiService.getGodaddyRepositories()).rejects.toThrow(
        'Network error'
      );
    });

    it('transforms repository with null description', async () => {
      const mockResponse: GitHubRepository[] = [
        {
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
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await GitHubApiService.getGodaddyRepositories();

      expect(result[0].description).toBe('No description available');
      expect(result[0].language).toBe('Not specified');
      expect(result[0].topics).toEqual([]);
      expect(result[0].license).toBeNull();
    });
  });

  describe('getRepositoryDetails', () => {
    it('fetches repository details successfully', async () => {
      const mockResponse: GitHubRepository = {
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

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await GitHubApiService.getRepositoryDetails('test-repo');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/godaddy/test-repo'
      );
      expect(result).toEqual({
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
      });
    });

    it('handles API error response for repository details', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        GitHubApiService.getRepositoryDetails('test-repo')
      ).rejects.toThrow('GitHub API error: 404 Not Found');
    });

    it('handles network error for repository details', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        GitHubApiService.getRepositoryDetails('test-repo')
      ).rejects.toThrow('Network error');
    });
  });
});
