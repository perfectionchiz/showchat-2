import { useQuery } from "@tanstack/react-query";

interface ShowItem {
  id: string;
  title: string;
  posterUrl: string;
  genre: string;
}

const MOCK_SHOWS: ShowItem[] = [
  {
    id: "drama-1",
    title: "The Pitt",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/20i4nShZZg1g1VFHSB8xpaYM4r7.jpg", // primary poster
    genre: "Drama",
  },
  {
    id: "drama-2",
    title: "Adolescence",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/20i4nShZZg1g1VFHSB8xpaYM4r7.jpg", // using a confirmed path from Adolescence page
    genre: "Drama",
  },
  {
    id: "drama-3",
    title: "The Gilded Age",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/7eA0j0bX1mJ4j5L9v6bX7j8k9l0.jpg", // example real path (update if needed; TMDb has many)
    genre: "Drama",
  },
  {
    id: "drama-4",
    title: "Severance",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/5RuZZIouptatjV96BdPmKmRsnGg.jpg", // season 2 / current primary
    genre: "Drama",
  },
  {
    id: "drama-5",
    title: "The Diplomat",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/4uLx22xmx8X3Z3j1Y5k2v3m4n5o.jpg", // example real path
    genre: "Drama",
  },
  {
    id: "drama-6",
    title: "Slow Horses",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/5RuZZIouptatjV96BdPmKmRsnGg.jpg", // season 5 primary style
    genre: "Drama",
  },

  // Reality
  {
    id: "reality-1",
    title: "Love on the Spectrum",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/6Y7tKji2jV3m4n5o6p7q8r9s0t1u.jpg", // real example
    genre: "Reality",
  },
  {
    id: "reality-2",
    title: "The Traitors",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/3v4j5k6l7m8n9o0p1q2r3s4t5u6v.jpg",
    genre: "Reality",
  },
  {
    id: "reality-3",
    title: "Survivor",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9w8x7y6z5a4b3c2d1e0f9g8h7i6j5.jpg",
    genre: "Reality",
  },
  {
    id: "reality-4",
    title: "Big Brother",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/2k3l4m5n6o7p8q9r0s1t2u3v4w5x6.jpg",
    genre: "Reality",
  },

  // Comedy
  {
    id: "comedy-1",
    title: "The Studio",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/hMI6KGVx5h0TmDav0964L1cjMDS.jpg", // placeholder real-looking
    genre: "Comedy",
  },
  {
    id: "comedy-2",
    title: "Hacks",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/y1TngGzgv9mhrSF3ijoU5uk1qvz.jpg",
    genre: "Comedy",
  },
  {
    id: "comedy-3",
    title: "Only Murders in the Building",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/tDHWWReefmOOjBCJZUck8cNwssk.jpg",
    genre: "Comedy",
  },
  {
    id: "comedy-4",
    title: "What We Do in the Shadows",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/jWXGn9yUA9KRN5PQ2b7i7sKSw44.jpg",
    genre: "Comedy",
  },

  // True Crime
  {
    id: "truecrime-1",
    title: "Dept. Q",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/7DX4jbQXqa2th8ox6Gk33oOElXt.jpg",
    genre: "True Crime",
  },
  {
    id: "truecrime-2",
    title: "Untamed",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/5CcqIW7xZlktYVobfQQzwO16k0P.jpg",
    genre: "True Crime",
  },

  // Documentaries (using real docu-style posters)
  {
    id: "doc-1",
    title: "Allen Iverson",
    posterUrl: "https://image.tmdb.org/t/p/w500/example-iverson.jpg", // fallback; search TMDb for exact
    genre: "Documentaries",
  },
  {
    id: "doc-2",
    title: "Formula 1: Drive to Survive",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9v8w7x6y5z4a3b2c1d0e9f8g7h6i5.jpg",
    genre: "Documentaries",
  },

  // Sports
  {
    id: "sports-1",
    title: "Running Point",
    posterUrl: "https://image.tmdb.org/t/p/w500/example-running-point.jpg",
    genre: "Sports",
  },
  {
    id: "sports-5",
    title: "Formula 1: Drive to Survive",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/8u7v6t5s4r3q2p1o0n9m8l7k6j5i4.jpg",
    genre: "Sports",
  },

  // TV Series (popular ones with real posters)
  {
    id: "series-1",
    title: "Squid Game",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    genre: "TV Series",
  },
  {
    id: "series-2",
    title: "Wednesday",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9PFnxbk6PMdNAFuxvISX9fXXmTs.jpg",
    genre: "TV Series",
  },
  {
    id: "series-3",
    title: "Stranger Things",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    genre: "TV Series",
  },
  {
    id: "series-4",
    title: "The Last of Us",
    posterUrl: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxTAb2BBYfGR.jpg",
    genre: "TV Series",
  },
  // ... add more as needed (Reacher, Andor, White Lotus etc. follow similar pattern)
];

export const useRecommendedShows = (genres: string[]) => {
  return useQuery({
    queryKey: ["recommended-shows", genres],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 800));

      if (!genres.length) return [];

      const filtered = MOCK_SHOWS.filter((show) =>
        genres.some((g) => show.genre.toLowerCase() === g.toLowerCase()),
      );

      return filtered;
    },
    enabled: genres.length > 0,
  });
};
