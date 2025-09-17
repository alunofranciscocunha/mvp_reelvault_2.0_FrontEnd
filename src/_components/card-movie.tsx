import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

export interface CardMovieProps {
  imageSrc: string;
  title: string;
  movieId: number;
}

const CardMovie = ({ movieId, imageSrc, title }: CardMovieProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const hasImage = !!imageSrc;

  return (
    <Card className="w-[154px] md:w-[185px] h-full flex-shrink-0 p-0 pb-2 border-0">
      <Link href={`/movies/${movieId}`} className="w-full h-full flex flex-col items-center">
        <CardContent className="p-0 flex flex-col gap-2">
          <div className="w-[154px] h-[215px] md:w-[185px] md:h-[270px] relative">
            {!hasImage ? (
              <Skeleton className="w-full h-full rounded-xl flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Sem imagem</span>
              </Skeleton>
            ) : (
              <>
                {isLoading && (
                  <Skeleton className="absolute top-0 left-0 w-full h-full rounded-xl" />
                )}
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, 154px"
                  className={`rounded-xl object-cover transition-transform duration-300 md:hover:scale-105 md:hover:cursor-pointer ${isLoading ? "invisible" : "visible"}`}
                  onLoad={() => setIsLoading(false)}
                />
              </>
            )}
          </div>
          <div className="px-2 w-[154px] md:w-[185px]">
            <p className="text-[10px] md:text-sm truncate overflow-hidden whitespace-nowrap font-semibold">
              {title}
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CardMovie;
