import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import RatingStars from "./rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { PenIcon, TrashIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import Rating from "@mui/material/Rating";

interface CommentCardProps {
  comment: {
    user_name: string;
    user_id?: string;
    id?: string;
    _id?: string;
    title: string;
    content: string;
    rating: number;
    isRecommended: boolean | null;
    date?: string;
    movieId?: string;
  };
  onDelete?: (id: string) => void;
  onEdit?: (updatedComment: any) => void;
}

function formatRelativeDate(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isToday(date)) {
    return `hoje às ${format(date, "HH:mm", { locale: ptBR })}`;
  }

  if (isYesterday(date)) {
    return "ontem";
  }

  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

const CommentCard = ({ comment, onDelete, onEdit }: CommentCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  let isOwner = false;
  let userId = null;
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      const decoded = jwtDecode<{ sub: string }>(token);
      userId = decoded.sub;
      if (comment.user_id && userId === comment.user_id) {
        isOwner = true;
      }
    }
  } catch {}

  // Formulário de edição
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: comment.title,
      content: comment.content,
      rating: comment.rating,
      isRecommended: comment.isRecommended,
    },
  });
  const recommended = watch("isRecommended");

  const handleEdit = async (data: any) => {
    const commentId = comment.id || comment._id;
    if (!commentId) return;
    const token = localStorage.getItem("token");
    // Garante movie_id inteiro
    const movieId = (comment as any).movie_id || (comment as any).movieId;
    try {
      await axios.put(
        `http://localhost:4000/comments/${commentId}`,
        {
          movie_id: Number(movieId),
          title: data.title,
          content: data.content,
          rating: Math.round(data.rating),
          isrecommended: data.isRecommended === true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comentário atualizado!");
      setEditOpen(false);
      if (onEdit) onEdit({
        ...comment,
        title: data.title,
        content: data.content,
        rating: Math.round(data.rating),
        isRecommended: data.isRecommended,
      });
    } catch {
      toast.error("Erro ao atualizar comentário!");
    }
  };

  const handleDelete = async () => {
    const commentId = comment.id || comment._id;
    if (!commentId) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:4000/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comentário removido!");
      if (onDelete) onDelete(commentId);
    } catch {
      toast.error("Erro ao remover comentário!");
    }
    setConfirmOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md border border-gray-700 flex-shrink-0 w-[350px]">
      <div className="flex gap-4 items-center">
        <Avatar>
          <AvatarImage src="/icons/Icon.svg" alt="Icone de usuario" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2 w-[50%]">
          <RatingStars ratingValue={comment.rating} />
          <h3 className="text-sm font-semibold">{comment.user_name}</h3>
        </div>
        {isOwner && (
          <div className="flex gap-3">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => setEditOpen(true)}>
                  <PenIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-md flex flex-col items-center">
                <form onSubmit={handleSubmit(handleEdit)} className="w-full space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-title" className="font-bold">Título:</label>
                    <input
                      id="edit-title"
                      className="border rounded px-2 py-1 w-full"
                      {...register("title", { required: "Título obrigatório" })}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-content" className="font-bold">Comentário:</label>
                    <textarea
                      id="edit-content"
                      className="border rounded px-2 py-1 w-full resize-y"
                      {...register("content", { required: "Comentário obrigatório" })}
                    />
                    {errors.content && <p className="text-red-500 text-sm">{errors.content.message as string}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <label>Recomenda:</label>
                    <Button
                      type="button"
                      variant={recommended === true ? "default" : "outline"}
                      onClick={() => setValue("isRecommended", true)}
                    >
                      <Image src="/icons/Like.svg" width={32} height={32} alt="Like" />
                    </Button>
                    <Button
                      type="button"
                      variant={recommended === false ? "default" : "outline"}
                      onClick={() => setValue("isRecommended", false)}
                    >
                      <Image src="/icons/Dislike.svg" width={32} height={32} alt="Dislike" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label>Estrelas:</label>
                    <Controller
                      name="rating"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Rating
                          {...field}
                          precision={0.5}
                          sx={{
                            color: "#34D399",
                            "& .MuiRating-iconEmpty": { color: "#B0B0B0" },
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
                    <Button type="submit" variant="default">Salvar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="icon" className="cursor-pointer" onClick={() => setConfirmOpen(true)}>
                  <TrashIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-xs flex flex-col items-center">
                <p className="mb-4 text-center">Tem certeza que deseja remover este comentário?</p>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={handleDelete}>Remover</Button>
                  <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <h2 className="font-bold text-wrap wrap-break-word">{comment.title}</h2>
      <p className="text-sm text-gray-300 wrap-break-word">
        {comment.content}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{formatRelativeDate(comment.date)}</p>
        <div className="flex gap-2">
          {comment.isRecommended ? (
            <Button variant="outline">
              Recomenda
              <Image
                src="/icons/Like.svg"
                width={32}
                height={32}
                alt="Icone de like"
              />
            </Button>
          ) : (
            <Button variant="outline">
              Não Recomenda
              <Image
                src="/icons/Dislike.svg"
                width={32}
                height={32}
                alt="Icone de Dislike"
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
