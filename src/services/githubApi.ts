import { GitHubRepository, RepositoryDetails } from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';
const GODADDY_ORG = 'godaddy';

export class GitHubApiService {
  private static async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching from GitHub API:', error);
      throw error;
    }
  }

  static async getGodaddyRepositories(): Promise<RepositoryDetails[]> {
    const url = `${GITHUB_API_BASE}/orgs/${GODADDY_ORG}/repos?per_page=100&sort=updated`;
    const repositories: GitHubRepository[] = await this.fetchWithErrorHandling(
      url
    );

    return repositories.map(repo => this.transformRepository(repo));
  }

  static async getRepositoryDetails(
    repoName: string
  ): Promise<RepositoryDetails> {
    const url = `${GITHUB_API_BASE}/repos/${GODADDY_ORG}/${repoName}`;
    const repository: GitHubRepository = await this.fetchWithErrorHandling(url);

    return this.transformRepository(repository);
  }

  private static transformRepository(
    repo: GitHubRepository
  ): RepositoryDetails {
    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description available',
      htmlUrl: repo.html_url,
      language: repo.language || 'Not specified',
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
      watchersCount: repo.watchers_count,
      stargazersCount: repo.stargazers_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      topics: repo.topics || [],
      isPrivate: repo.private,
      isArchived: repo.archived,
      license: repo.license?.name || null,
    };
  }
}
