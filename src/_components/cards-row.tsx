"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";

import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import CardMovie from "./card-movie";

export interface MoviesProps {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface CardsRowProps {
  title: string;
  movies: MoviesProps[];
}
export function CardsRow({ title, movies }: CardsRowProps) {
  // Referência para a div que faz o scroll horizontal dos cards
  const rowRef = useRef<HTMLDivElement>(null);
  // Estado para controlar se a seta esquerda deve aparecer
  const [showLeft, setShowLeft] = useState(false);

  // Função para rolar para a direita ao clicar na seta direita
  const handleScrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Função para rolar para a esquerda ao clicar na seta esquerda
  const handleScrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Efeito para mostrar/esconder a seta esquerda conforme o scroll horizontal
  useEffect(() => {
    const handleScroll = () => {
      if (rowRef.current) {
        setShowLeft(rowRef.current.scrollLeft > 0);
      }
    };
    const ref = rowRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      // Atualiza ao montar
      setShowLeft(ref.scrollLeft > 0);
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full mb-6">
      <h2 className="mb-3 md:text-base mt-6 text-xs font-bold capitalize text-gray-400 md:text-white">
        {title}
      </h2>
      <div className="relative w-full">
        {/* Seta para a esquerda, aparece apenas se showLeft for true */}
        {showLeft && (
          <div className="hidden md:block">
            <Button
              type="button"
              className="md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-10 transition-opacity duration-200"
              style={{ display: "flex", alignItems: "center" }}
              onClick={handleScrollLeft}
              aria-label="Scroll para esquerda"
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
        )}
        <div
          ref={rowRef}
          className="flex w-full gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden md:h-[310px] md:p-2 scroll-smooth"
        >
            {/* Cards de filmes */}
          {movies &&
            movies.map((movie) => (
              <CardMovie
                key={movie.id}
                movieId={movie.id}
                imageSrc={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                title={movie.title}
              />
            ))}

          {movies.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhum filme encontrado.</p>
          )}
        </div>
        {/* Seta para a direita, sempre visível em desktop */}
        <div className="hidden md:block">
          <Button
            type="button"
            className="md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-10 transition-opacity duration-200"
            style={{ display: "flex", alignItems: "center" }}
            onClick={handleScrollRight}
            aria-label="Scroll para direita"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
