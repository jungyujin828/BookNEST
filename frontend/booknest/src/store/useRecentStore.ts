import { create } from "zustand";

interface RecentSearch {
  query: string;
  timestamp: number;
}

interface RecentStore {
  recentSearches: RecentSearch[];
  addRecent: (query: string) => void;
  removeRecent: (query: string) => void;
  clearRecent: () => void;
}

export const useRecentStore = create<RecentStore>((set) => ({
  recentSearches: JSON.parse(localStorage.getItem("recentSearches") || "[]"),

  addRecent: (query: string) => {
    if (!query.trim()) return;

    set((state) => {
      const newRecent = [
        { query, timestamp: Date.now() },
        ...state.recentSearches.filter((item) => item.query !== query),
      ].slice(0, 8); // 최대 8개까지만 저장

      localStorage.setItem("recentSearches", JSON.stringify(newRecent));
      return { recentSearches: newRecent };
    });
  },

  removeRecent: (query: string) => {
    set((state) => {
      const newRecent = state.recentSearches.filter(
        (item) => item.query !== query
      );
      localStorage.setItem("recentSearches", JSON.stringify(newRecent));
      return { recentSearches: newRecent };
    });
  },

  clearRecent: () => {
    localStorage.removeItem("recentSearches");
    set({ recentSearches: [] });
  },
}));
