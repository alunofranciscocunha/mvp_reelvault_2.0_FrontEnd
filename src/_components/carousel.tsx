"use client";

import Autoplay from "embla-carousel-autoplay";
import * as React from "react";
import axios from "axios";

import { Card } from "@/_components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/_components/ui/carousel";
import { cn } from "@/_lib/utils";
import { Trophy } from "lucide-react";
import TopMovieCard from "./top-movie-card";

import { MoviesProps } from "./cards-row"; // ajuste o path se necessário

const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

export default function CarouselSlide() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [nowPlaying, setNowPlaying] = React.useState<MoviesProps[]>([]);


  React.useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            accept: "application/json",
          },
          params: {
            language: "pt-BR",
            page: 1,
          },
        });
        setNowPlaying(res.data.results);
      } catch (error) {
        console.error("Erro ao buscar os filmes em cartaz:", error);
      }
    };

    fetchNowPlaying();
  }, []);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const currentMovie =
    nowPlaying[(current - 1 + nowPlaying.length) % nowPlaying.length];
  const backdropUrl = currentMovie
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : "";

  return (
    <div className="relative md:w-full md:h-[490px]">
      <div
        className="hidden md:block absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.5s",
        }}
      />
      <div className="hidden md:block absolute inset-0 w-full h-full z-10 backdrop-blur-[1px] bg-black/40" />

      <div className="relative z-20 md:h-[400px] w-full md:p-2">
        <div className="w-full flex items-center justify-center z-20 py-4 gap-1">
          <Trophy size={14} />
          <h2 className="md:text-base text-xs font-bold capitalize text-gray-400 md:text-white text-center">
            Destaques do Dia
          </h2>
          <Trophy size={14} />
        </div>

        <div className="mx-auto max-w-xs md:max-w-[800px] md:h-[100%] md:flex md:items-center md:p-3">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ loop: true }}
            plugins={[
              Autoplay({
                delay: 8000,
              }),
            ]}
          >
            <CarouselContent className="py-3">
              {nowPlaying.slice(0, 5).map((movie, index) => (
                <CarouselItem
                  key={movie.id}
                  className={cn("pl-0 basis-[50%] md:basis-[32%]")}
                >
                  <Card
                    className={cn(
                      "w-[180px] h-[270px] md:h-[100%] p-0 rounded-xl border-0 transition-transform duration-500",
                      {
                        "scale-[0.8]": index !== current - 1,
                      }
                    )}
                  >
                    <TopMovieCard movie={movie} ranking={index + 1} />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
