import { create } from 'zustand';

interface Book {
  bookId: number;
  title: string;
  publishedDate: string;
  imageUrl: string;
  authors: string[];
}

interface BookState {
  bestSellers: Book[];
  regionalBooks: Book[];
  authorBooks: Book[];
  loading: {
    bestSellers: boolean;
    regionalBooks: boolean;
    authorBooks: boolean;
  };
  error: {
    bestSellers: string | null;
    regionalBooks: string | null;
    authorBooks: string | null;
  };
  setBestSellers: (books: Book[]) => void;
  setRegionalBooks: (books: Book[]) => void;
  setAuthorBooks: (books: Book[]) => void;
  setLoading: (key: keyof BookState['loading'], value: boolean) => void;
  setError: (key: keyof BookState['error'], value: string | null) => void;
}

export const useBookStore = create<BookState>((set) => ({
  bestSellers: [],
  regionalBooks: [],
  authorBooks: [],
  loading: {
    bestSellers: false,
    regionalBooks: false,
    authorBooks: false,
  },
  error: {
    bestSellers: null,
    regionalBooks: null,
    authorBooks: null,
  },
  setBestSellers: (books) => set({ bestSellers: books }),
  setRegionalBooks: (books) => set({ regionalBooks: books }),
  setAuthorBooks: (books) => set({ authorBooks: books }),
  setLoading: (key, value) => 
    set((state) => ({ 
      loading: { ...state.loading, [key]: value } 
    })),
  setError: (key, value) => 
    set((state) => ({ 
      error: { ...state.error, [key]: value } 
    })),
})); 