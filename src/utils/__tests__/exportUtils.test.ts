import { exportToCSV, exportToJSON, getExportStats } from '../exportUtils';
import { RepositoryDetails } from '../../types/github';

// Mock Date methods
const mockDate = new Date('2023-01-01T00:00:00Z');
const originalDate = global.Date;

beforeEach(() => {
  // Mock Date constructor and methods
  const MockDate = jest.fn(() => mockDate) as unknown as typeof Date;
  (MockDate as unknown as { now: jest.Mock }).now = jest.fn(() =>
    mockDate.getTime()
  );
  (
    MockDate as unknown as {
      prototype: { toLocaleDateString: jest.Mock; toISOString: jest.Mock };
    }
  ).prototype.toLocaleDateString = jest.fn(() => '2023-01-01');
  (
    MockDate as unknown as {
      prototype: { toLocaleDateString: jest.Mock; toISOString: jest.Mock };
    }
  ).prototype.toISOString = jest.fn(() => '2023-01-01T00:00:00.000Z');
  global.Date = MockDate as unknown as typeof Date;

  // Mock window.URL.createObjectURL
  Object.defineProperty(window, 'URL', {
    value: {
      createObjectURL: jest.fn(() => 'blob:mock-url'),
      revokeObjectURL: jest.fn(),
    },
    writable: true,
  });

  // Mock document.createElement and related methods
  const mockLink = {
    setAttribute: jest.fn(),
    click: jest.fn(),
    style: {},
  };

  Object.defineProperty(document, 'createElement', {
    value: jest.fn(() => mockLink),
    writable: true,
  });

  Object.defineProperty(document.body, 'appendChild', {
    value: jest.fn(),
    writable: true,
  });

  Object.defineProperty(document.body, 'removeChild', {
    value: jest.fn(),
    writable: true,
  });

  // Mock window.alert
  Object.defineProperty(window, 'alert', {
    value: jest.fn(),
    writable: true,
  });
});

afterEach(() => {
  global.Date = originalDate;
  jest.restoreAllMocks();
});

const mockRepository: RepositoryDetails = {
  id: 1,
  name: 'test-repo',
  fullName: 'test/test-repo',
  description: 'Test repository description',
  htmlUrl: 'https://github.com/test/test-repo',
  language: 'JavaScript',
  forksCount: 10,
  openIssuesCount: 5,
  watchersCount: 20,
  stargazersCount: 100,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
  topics: ['react', 'typescript'],
  isPrivate: false,
  isArchived: false,
  license: 'MIT',
};

const mockRepositories = [
  mockRepository,
  {
    ...mockRepository,
    id: 2,
    name: 'test-repo-2',
    language: 'TypeScript',
    isPrivate: true,
    isArchived: true,
  },
];

describe('exportUtils', () => {
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date('2023-01-01T12:00:00Z');
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('exportToCSV', () => {
    it('exports repositories to CSV format', () => {
      const mockRepositories = [
        {
          id: 1,
          name: 'test-repo',
          fullName: 'godaddy/test-repo',
          description: 'Test repository',
          htmlUrl: 'https://github.com/godaddy/test-repo',
          stargazersCount: 100,
          forksCount: 50,
          watchersCount: 25,
          openIssuesCount: 10,
          language: 'JavaScript',
          isPrivate: false,
          isArchived: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          license: 'MIT',
          topics: ['react', 'typescript'],
        },
      ];

      const result = exportToCSV(mockRepositories);

      expect(result).toContain(
        '"ID","Name","Full Name","Description","URL","Stars","Forks","Watchers","Open Issues","Language","Private","Archived","Created","Updated","License","Topics"'
      );
      expect(result).toContain(
        '"1","test-repo","godaddy/test-repo","Test repository","https://github.com/godaddy/test-repo","100","50","25","10","JavaScript","false","false","2023-01-01T00:00:00Z","2023-01-02T00:00:00Z","MIT","react,typescript"'
      );
    });

    it('handles empty repositories array', () => {
      const result = exportToCSV([]);
      expect(result).toBe(
        'ID,Name,Full Name,Description,URL,Stars,Forks,Watchers,Open Issues,Language,Private,Archived,Created,Updated,License,Topics\n'
      );
    });

    it('handles repositories with missing optional fields', () => {
      const mockRepositories = [
        {
          id: 1,
          name: 'test-repo',
          fullName: 'godaddy/test-repo',
          description: '',
          htmlUrl: 'https://github.com/godaddy/test-repo',
          stargazersCount: 100,
          forksCount: 50,
          watchersCount: 25,
          openIssuesCount: 10,
          language: '',
          isPrivate: false,
          isArchived: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          license: '',
          topics: [],
        },
      ];

      const result = exportToCSV(mockRepositories);

      expect(result).toContain(
        '"1","test-repo","godaddy/test-repo","","https://github.com/godaddy/test-repo","100","50","25","10","","false","false","2023-01-01T00:00:00Z","2023-01-02T00:00:00Z","",""'
      );
    });

    it('escapes special characters in CSV', () => {
      const mockRepositories = [
        {
          id: 1,
          name: 'test-repo',
          fullName: 'godaddy/test-repo',
          description: 'Test "quoted" description with, comma',
          htmlUrl: 'https://github.com/godaddy/test-repo',
          stargazersCount: 100,
          forksCount: 50,
          watchersCount: 25,
          openIssuesCount: 10,
          language: 'JavaScript',
          isPrivate: false,
          isArchived: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          license: 'MIT',
          topics: ['react', 'typescript'],
        },
      ];

      const result = exportToCSV(mockRepositories);

      expect(result).toContain('"Test ""quoted"" description with, comma"');
    });
  });

  describe('exportToJSON', () => {
    it('exports repositories to JSON format', () => {
      const result = exportToJSON([mockRepository]);
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('exportDate');
      expect(parsed.totalRepositories).toBe(1);
      expect(parsed.repositories[0].name).toBe('test-repo');
    });

    it('handles empty repositories array for JSON', () => {
      const result = exportToJSON([]);
      const parsed = JSON.parse(result);
      expect(parsed.totalRepositories).toBe(0);
      expect(parsed.repositories).toEqual([]);
    });
  });

  describe('getExportStats', () => {
    it('calculates correct statistics for repositories', () => {
      const stats = getExportStats(mockRepositories);

      expect(stats.totalRepos).toBe(2);
      expect(stats.publicRepos).toBe(1);
      expect(stats.privateRepos).toBe(1);
      expect(stats.archivedRepos).toBe(1);
      expect(stats.totalStars).toBe(200); // 100 + 100
      expect(stats.totalForks).toBe(20); // 10 + 10
      expect(stats.totalIssues).toBe(10); // 5 + 5
    });

    it('handles empty repository list', () => {
      const stats = getExportStats([]);

      expect(stats.totalRepos).toBe(0);
      expect(stats.publicRepos).toBe(0);
      expect(stats.privateRepos).toBe(0);
      expect(stats.archivedRepos).toBe(0);
      expect(stats.totalStars).toBe(0);
      expect(stats.totalForks).toBe(0);
      expect(stats.totalIssues).toBe(0);
      expect(stats.languages).toEqual({});
    });

    it('counts languages correctly', () => {
      const stats = getExportStats(mockRepositories);

      expect(stats.languages).toEqual({
        JavaScript: 1,
        TypeScript: 1,
      });
    });

    it('handles repositories without language', () => {
      const repoWithoutLanguage: RepositoryDetails = {
        ...mockRepository,
        language: null as unknown as string,
      };

      const stats = getExportStats([repoWithoutLanguage]);

      expect(stats.languages).toEqual({});
    });

    it('handles repositories with same language', () => {
      const sameLanguageRepos = [
        { ...mockRepository, id: 1 },
        { ...mockRepository, id: 2 },
        { ...mockRepository, id: 3 },
      ];

      const stats = getExportStats(sameLanguageRepos);

      expect(stats.languages).toEqual({
        JavaScript: 3,
      });
    });

    it('calculates correct counts for mixed repository types', () => {
      const mixedRepos = [
        { ...mockRepository, id: 1, isPrivate: false, isArchived: false },
        { ...mockRepository, id: 2, isPrivate: true, isArchived: false },
        { ...mockRepository, id: 3, isPrivate: false, isArchived: true },
        { ...mockRepository, id: 4, isPrivate: true, isArchived: true },
      ];

      const stats = getExportStats(mixedRepos);

      expect(stats.totalRepos).toBe(4);
      expect(stats.publicRepos).toBe(2);
      expect(stats.privateRepos).toBe(2);
      expect(stats.archivedRepos).toBe(2);
    });
  });
});

export {};
