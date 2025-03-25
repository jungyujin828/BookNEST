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
  ageBooks: Book[];
  criticBooks: Book[];
  authorRatingBooks: Book[];
  loading: {
    bestSellers: boolean;
    regionalBooks: boolean;
    authorBooks: boolean;
    ageBooks: boolean;
    criticBooks: boolean;
    authorRatingBooks: boolean;
  };
  error: {
    bestSellers: string | null;
    regionalBooks: string | null;
    authorBooks: string | null;
    ageBooks: string | null;
    criticBooks: string | null;
    authorRatingBooks: string | null;
  };
  setBestSellers: (books: Book[]) => void;
  setRegionalBooks: (books: Book[]) => void;
  setAuthorBooks: (books: Book[]) => void;
  setAgeBooks: (books: Book[]) => void;
  setCriticBooks: (books: Book[]) => void;
  setAuthorRatingBooks: (books: Book[]) => void;
  setLoading: (key: keyof BookState['loading'], value: boolean) => void;
  setError: (key: keyof BookState['error'], value: string | null) => void;
}

export const useBookStore = create<BookState>((set) => ({
  bestSellers: [],
  regionalBooks: [],
  authorBooks: [],
  ageBooks: [],
  criticBooks: [],
  authorRatingBooks: [],
  loading: {
    bestSellers: false,
    regionalBooks: false,
    authorBooks: false,
    ageBooks: false,
    criticBooks: false,
    authorRatingBooks: false,
  },
  error: {
    bestSellers: null,
    regionalBooks: null,
    authorBooks: null,
    ageBooks: null,
    criticBooks: null,
    authorRatingBooks: null,
  },
  setBestSellers: (books) => set({ bestSellers: books }),
  setRegionalBooks: (books) => set({ regionalBooks: books }),
  setAuthorBooks: (books) => set({ authorBooks: books }),
  setAgeBooks: (books) => set({ ageBooks: books }),
  setCriticBooks: (books) => set({ criticBooks: books }),
  setAuthorRatingBooks: (books) => set({ authorRatingBooks: books }),
  setLoading: (key, value) => 
    set((state) => ({ 
      loading: { ...state.loading, [key]: value } 
    })),
  setError: (key, value) => 
    set((state) => ({ 
      error: { ...state.error, [key]: value } 
    })),
})); 