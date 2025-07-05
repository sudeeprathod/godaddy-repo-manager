import { RepositoryDetails } from '../types/github';

export const exportToCSV = (
  repositories: RepositoryDetails[],
  filename: string = 'repositories'
) => {
  if (repositories.length === 0) {
    alert('No repositories to export');
    // Return header row for testing
    return 'ID,Name,Full Name,Description,URL,Stars,Forks,Watchers,Open Issues,Language,Private,Archived,Created,Updated,License,Topics\n';
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Full Name',
    'Description',
    'URL',
    'Stars',
    'Forks',
    'Watchers',
    'Open Issues',
    'Language',
    'Private',
    'Archived',
    'Created',
    'Updated',
    'License',
    'Topics',
  ];

  // Convert repositories to CSV rows
  const csvRows = repositories.map(repo => [
    repo.id,
    repo.name,
    repo.fullName,
    repo.description || '',
    repo.htmlUrl,
    repo.stargazersCount,
    repo.forksCount,
    repo.watchersCount,
    repo.openIssuesCount,
    repo.language || '',
    repo.isPrivate ? 'true' : 'false',
    repo.isArchived ? 'true' : 'false',
    repo.createdAt,
    repo.updatedAt,
    repo.license || '',
    repo.topics?.join(',') || '',
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...csvRows]
    .map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Return for testing
  return csvContent;
};

export const exportToJSON = (
  repositories: RepositoryDetails[],
  filename: string = 'repositories'
) => {
  if (repositories.length === 0) {
    alert('No repositories to export');
    // Return empty JSON for testing
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      totalRepositories: 0,
      repositories: [],
    });
  }

  // Prepare data for export
  const exportData = {
    exportDate: new Date().toISOString(),
    totalRepositories: repositories.length,
    repositories: repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.fullName,
      description: repo.description,
      htmlUrl: repo.htmlUrl,
      stargazersCount: repo.stargazersCount,
      forksCount: repo.forksCount,
      watchersCount: repo.watchersCount,
      openIssuesCount: repo.openIssuesCount,
      language: repo.language,
      isPrivate: repo.isPrivate,
      isArchived: repo.isArchived,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      license: repo.license,
      topics: repo.topics,
    })),
  };

  // Create and download file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json;charset=utf-8;',
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${filename}_${new Date().toISOString().split('T')[0]}.json`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Return for testing
  return JSON.stringify(exportData);
};

export const getExportStats = (repositories: RepositoryDetails[]) => {
  const totalRepos = repositories.length;
  const publicRepos = repositories.filter(repo => !repo.isPrivate).length;
  const privateRepos = totalRepos - publicRepos;
  const archivedRepos = repositories.filter(repo => repo.isArchived).length;

  const languages = repositories.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazersCount,
    0
  );
  const totalForks = repositories.reduce(
    (sum, repo) => sum + repo.forksCount,
    0
  );
  const totalIssues = repositories.reduce(
    (sum, repo) => sum + repo.openIssuesCount,
    0
  );

  return {
    totalRepos,
    publicRepos,
    privateRepos,
    archivedRepos,
    languages,
    totalStars,
    totalForks,
    totalIssues,
  };
};
