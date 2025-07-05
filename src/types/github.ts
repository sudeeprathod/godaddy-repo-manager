export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  topics: string[];
  visibility: string;
  archived: boolean;
  disabled: boolean;
  default_branch: string;
}

export interface RepositoryDetails {
  id: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  language: string;
  forksCount: number;
  openIssuesCount: number;
  watchersCount: number;
  stargazersCount: number;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  isPrivate: boolean;
  isArchived: boolean;
  license: string | null;
}
