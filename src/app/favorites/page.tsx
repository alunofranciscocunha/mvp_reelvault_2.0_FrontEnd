"use client";
import CardMovie from "@/_components/card-movie";
import Header from "@/_components/header";
import Search from "@/_components/search";
import { Button } from "@/_components/ui/button";
import { TrashIcon } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface Favorite {
  id?: string;
  _id?: string;
  movie_id: number;
  poster_path: string;
  title: string;
}

const Favorites = () => {
  const [favMovies, setFavMovies] = useState<Favorite[]>([]);
  //Pega os filmes favoritos do banco de dados quando o componente for renderizado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFavMovies([]);
      return;
    }
    let userId: string | null = null;
    try {
      const decoded = jwtDecode<{ sub: string }>(token);
      userId = decoded.sub;
    } catch {
      setFavMovies([]);
      return;
    }
    axios
      .get(`http://localhost:4000/favorites/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFavMovies(res.data as Favorite[]);
      })
      .catch(() => setFavMovies([]));
  }, []);
  //Funcao que remove o filme dos favoritos e atualiza o state dos filmes
  const handleRemoveFromFavorites = async (favoriteId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`http://localhost:4000/favorites/${favoriteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavMovies((prev) =>
        prev
          ? prev.filter(
              (fav) => fav.id !== favoriteId && fav._id !== favoriteId
            )
          : []
      );
      toast.success("Filme removido dos favoritos!");
    } catch (error: unknown) {
      toast.error("Erro ao remover dos favoritos!");
    }
  };

  return (
    <div>
      <Header />
      <div className="my-6 px-5 md:hidden md:px-62">
        <Search />
      </div>
      <div className="px-5 mt-6 md:px-32">
        <h2 className="mb-3 md:mb-5 text-xs md:text-base md:text-white font-bold uppercase w-full truncate">
          Favoritos
        </h2>
        {favMovies && favMovies.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            Nenhum filme favorito encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favMovies?.map((fv) => (
              <div key={fv.id || fv._id} className="relative">
                <CardMovie
                  movieId={fv.movie_id}
                  imageSrc={`https://image.tmdb.org/t/p/original/${fv.poster_path}`}
                  title={fv.title}
                />
                <Button
                  variant="destructive"
                  size={"sm"}
                  className="absolute top-0 bg-gray-500"
                  onClick={() => {
                    const favId = fv.id || fv._id;
                    if (favId) handleRemoveFromFavorites(favId);
                  }}
                >
                  <TrashIcon />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
