import { RepositoryDetails } from '../types/github';

const BOOKMARK_STORAGE_KEY = 'godaddy_repo_bookmarks';

export interface BookmarkedRepository extends RepositoryDetails {
  bookmarkedAt: string;
}

export class BookmarkService {
  private static getStoredBookmarks(): BookmarkedRepository[] {
    try {
      const stored = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error reading bookmarks from localStorage:', error);
      return [];
    }
  }

  private static saveBookmarks(bookmarks: BookmarkedRepository[]): void {
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving bookmarks to localStorage:', error);
    }
  }

  static addBookmark(repository: RepositoryDetails): boolean {
    const bookmarks = this.getStoredBookmarks();
    const existingIndex = bookmarks.findIndex(
      bookmark => bookmark.id === repository.id
    );

    if (existingIndex !== -1) {
      return false; // Already bookmarked
    }

    const bookmarkedRepo: BookmarkedRepository = {
      ...repository,
      bookmarkedAt: new Date().toISOString(),
    };

    bookmarks.push(bookmarkedRepo);
    this.saveBookmarks(bookmarks);
    return true;
  }

  static removeBookmark(repositoryId: number): boolean {
    const bookmarks = this.getStoredBookmarks();
    const initialLength = bookmarks.length;
    const filteredBookmarks = bookmarks.filter(
      bookmark => bookmark.id !== repositoryId
    );

    if (filteredBookmarks.length === initialLength) {
      return false; // Not found
    }

    this.saveBookmarks(filteredBookmarks);
    return true;
  }

  static isBookmarked(repositoryId: number): boolean {
    const bookmarks = this.getStoredBookmarks();
    return bookmarks.some(bookmark => bookmark.id === repositoryId);
  }

  static getBookmarks(): BookmarkedRepository[] {
    return this.getStoredBookmarks();
  }

  static getBookmarkCount(): number {
    return this.getStoredBookmarks().length;
  }

  static clearAllBookmarks(): void {
    this.saveBookmarks([]);
  }

  static exportBookmarks(): string {
    const bookmarks = this.getStoredBookmarks();
    return JSON.stringify(bookmarks, null, 2);
  }

  static importBookmarks(jsonData: string): boolean {
    try {
      const bookmarks = JSON.parse(jsonData);
      if (Array.isArray(bookmarks)) {
        this.saveBookmarks(bookmarks);
        return true;
      }
      return false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error importing bookmarks:', error);
      return false;
    }
  }
}
