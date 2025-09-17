"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { Button } from "./ui/button"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import Search from "./search"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { LogInIcon, LogOutIcon } from "lucide-react"
import SignInDialog from "./sign-in-dialog"

interface JwtPayload {
  username: string;
  exp: number;
}

const SidebarSheet = () => {
  const [username, setUsername] = useState<string | null>(null)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    const updateUsername = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
            localStorage.removeItem("token");
            setUsername(null);
          } else {
            setUsername(decoded.username);
          }
        } catch {
          setUsername(null);
        }
      } else {
        setUsername(null);
      }
    };
    updateUsername();
    window.addEventListener("storage", updateUsername);
    return () => window.removeEventListener("storage", updateUsername);
  }, [])

  const handleLoginSuccess = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUsername(decoded.username);
      } catch {
        setUsername(null);
      }
    }
    setLoginDialogOpen(false);
  };

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid  p-5">
        {username ? (
          <div className="flex items-center w-full ">
            <Avatar>
              <AvatarImage src="" />
            </Avatar>
            <div className="flex justify-between w-full">
              <div>
                <p className="font-bold">{`Olá, ${username}!`}</p>
                <p className="font-bold">{`Seja bem-vindo!`}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => {
                  localStorage.removeItem("token");
                  setUsername(null);
                  window.dispatchEvent(new StorageEvent("storage", { key: "token" }));
                }}
              >
                <LogOutIcon />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-between w-full">
            <h2 className="font-bold">Olá, faça seu login!</h2>
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon">
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%]">
                <SignInDialog onLoginSuccess={handleLoginSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-b border-solid p-5">
        <Search />
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <Image alt="Voltar para o inicio" src="/icons/home.svg" width={16} height={16} />
              Inicio
            </Link>
          </Button>
        </SheetClose>
        <Button className="justify-start gap-2" variant="ghost" asChild>
          <Link href="/favorites">
            <Image alt="Favoritos" src="/icons/star.svg" width={14} height={14}/>
            Favoritos
          </Link>
        </Button>
      </div>
    </SheetContent>
  )
}

export default SidebarSheet