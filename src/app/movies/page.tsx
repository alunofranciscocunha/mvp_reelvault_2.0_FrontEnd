"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/_components/header";
import Search from "@/_components/search";
import axios from "axios";
import CardMovie from "@/_components/card-movie";

interface Movie {
  id: number;
  poster_path: string | null;
  title: string;
}

const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

const MoviesContent = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";
  const [movies, setMovies] = useState<Movie[] | null>(null);

  useEffect(() => {
    const getMovies = async (title: string) => {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/search/movie",
          {
            params: {
              language: "pt-BR",
              query: title,
            },
            headers: {
              Authorization: `Bearer ${TMDB_TOKEN}`,
            },
          }
        );
        setMovies(res.data.results as Movie[]);
      } catch {
        setMovies(null);
      }
    };

    if (title) {
      getMovies(title);
    } else {
      setMovies(null);
    }
  }, [title]);

  return (
    <div>
      <Header />
      <div className="my-6 px-5 md:hidden md:px-62 ">
        <Search />
      </div>
      <div className="px-5 mt-6 md:px-32">
        <h2 className="mb-3 md:mb-5 text-xs md:text-base md:text-white font-bold uppercase text-gray-400 w-full truncate">
          Resultados para &quot;{title}&quot;
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies?.map((movie) => (
            <CardMovie
              key={movie.id}
              movieId={movie.id}
              imageSrc={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              title={movie.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


export default function MoviesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MoviesContent />
    </Suspense>
  );
}
