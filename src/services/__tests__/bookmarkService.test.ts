import { BookmarkService, BookmarkedRepository } from '../bookmarkService';
import { RepositoryDetails } from '../../types/github';

let store: Record<string, string>;

beforeEach(() => {
  store = {};
  const localStorageMock = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
});

const mockRepository: RepositoryDetails = {
  id: 1,
  name: 'test-repo',
  fullName: 'test/test-repo',
  description: 'Test repository',
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

describe('BookmarkService', () => {
  it('adds a new bookmark successfully', () => {
    const result = BookmarkService.addBookmark(mockRepository);
    expect(result).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'godaddy_repo_bookmarks',
      expect.stringContaining('test-repo')
    );
  });

  it('returns false when repository is already bookmarked', () => {
    BookmarkService.addBookmark(mockRepository);
    const result = BookmarkService.addBookmark(mockRepository);
    expect(result).toBe(false);
  });

  it('removes an existing bookmark successfully', () => {
    BookmarkService.addBookmark(mockRepository);
    const result = BookmarkService.removeBookmark(mockRepository.id);
    expect(result).toBe(true);
  });

  it('returns false when repository is not bookmarked', () => {
    const result = BookmarkService.removeBookmark(999);
    expect(result).toBe(false);
  });

  it('returns true for bookmarked repository', () => {
    BookmarkService.addBookmark(mockRepository);
    const result = BookmarkService.isBookmarked(mockRepository.id);
    expect(result).toBe(true);
  });

  it('returns false for non-bookmarked repository', () => {
    const result = BookmarkService.isBookmarked(999);
    expect(result).toBe(false);
  });

  it('returns empty array when no bookmarks exist', () => {
    const bookmarks = BookmarkService.getBookmarks();
    expect(bookmarks).toEqual([]);
  });

  it('returns all bookmarks', () => {
    BookmarkService.addBookmark(mockRepository);
    const bookmarks = BookmarkService.getBookmarks();
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].name).toBe('test-repo');
    expect(bookmarks[0].bookmarkedAt).toBeDefined();
  });

  it('returns 0 when no bookmarks exist', () => {
    const count = BookmarkService.getBookmarkCount();
    expect(count).toBe(0);
  });

  it('returns correct count when bookmarks exist', () => {
    BookmarkService.addBookmark(mockRepository);
    const count = BookmarkService.getBookmarkCount();
    expect(count).toBe(1);
  });

  it('clears all bookmarks', () => {
    BookmarkService.addBookmark(mockRepository);
    BookmarkService.clearAllBookmarks();
    expect(BookmarkService.getBookmarkCount()).toBe(0);
  });

  it('exports bookmarks as JSON string', () => {
    BookmarkService.addBookmark(mockRepository);
    const exportData = BookmarkService.exportBookmarks();
    expect(typeof exportData).toBe('string');
    const parsed = JSON.parse(exportData);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('test-repo');
  });

  it('exports empty array when no bookmarks exist', () => {
    const exportData = BookmarkService.exportBookmarks();
    expect(typeof exportData).toBe('string');
    const parsed = JSON.parse(exportData);
    expect(parsed).toEqual([]);
  });

  it('imports valid bookmarks successfully', () => {
    const importData = JSON.stringify([mockRepository]);
    const result = BookmarkService.importBookmarks(importData);
    expect(result).toBe(true);
    expect(BookmarkService.getBookmarkCount()).toBe(1);
  });

  it('returns false for invalid JSON', () => {
    const result = BookmarkService.importBookmarks('invalid json');
    expect(result).toBe(false);
  });

  it('returns false for non-array data', () => {
    const result = BookmarkService.importBookmarks('{"not": "array"}');
    expect(result).toBe(false);
  });

  it('includes bookmark timestamp when adding', () => {
    BookmarkService.addBookmark(mockRepository);
    const bookmarks = BookmarkService.getBookmarks();
    const bookmark = bookmarks[0] as BookmarkedRepository;
    expect(bookmark.bookmarkedAt).toBeDefined();
    expect(new Date(bookmark.bookmarkedAt).getTime()).toBeGreaterThan(0);
  });

  it('preserves all repository data when bookmarking', () => {
    BookmarkService.addBookmark(mockRepository);
    const bookmarks = BookmarkService.getBookmarks();
    const bookmark = bookmarks[0];
    expect(bookmark.id).toBe(mockRepository.id);
    expect(bookmark.name).toBe(mockRepository.name);
    expect(bookmark.description).toBe(mockRepository.description);
    expect(bookmark.language).toBe(mockRepository.language);
  });

  it('adds and removes bookmark', () => {
    BookmarkService.addBookmark(mockRepository);
    expect(BookmarkService.isBookmarked(mockRepository.id)).toBe(true);
    BookmarkService.removeBookmark(mockRepository.id);
    expect(BookmarkService.isBookmarked(mockRepository.id)).toBe(false);
  });

  it('does not add duplicate bookmarks', () => {
    BookmarkService.addBookmark(mockRepository);
    BookmarkService.addBookmark(mockRepository);
    expect(BookmarkService.getBookmarkCount()).toBe(1);
  });

  it('removes only the correct bookmark', () => {
    const repo2 = { ...mockRepository, id: 2, name: 'test-repo-2' };
    BookmarkService.addBookmark(mockRepository);
    BookmarkService.addBookmark(repo2);
    BookmarkService.removeBookmark(mockRepository.id);
    expect(BookmarkService.isBookmarked(mockRepository.id)).toBe(false);
    expect(BookmarkService.isBookmarked(repo2.id)).toBe(true);
  });

  it('handles corrupted localStorage gracefully', () => {
    Object.defineProperty(window.localStorage, 'getItem', {
      value: jest.fn(() => 'invalid json'),
      writable: true,
    });
    const bookmarks = BookmarkService.getBookmarks();
    expect(bookmarks).toEqual([]);
  });

  it('handles missing bookmarks gracefully', () => {
    Object.defineProperty(window.localStorage, 'getItem', {
      value: jest.fn(() => null),
      writable: true,
    });
    const bookmarks = BookmarkService.getBookmarks();
    expect(bookmarks).toEqual([]);
  });

  it('returns false if not bookmarked', () => {
    expect(BookmarkService.isBookmarked(999)).toBe(false);
  });
});

export {};
