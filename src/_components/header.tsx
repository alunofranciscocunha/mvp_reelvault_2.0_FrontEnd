"use client"
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Search from "./search";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Sheet, SheetTrigger } from "./ui/sheet";
import SidebarSheet from "./sidebar-sheet";
import { jwtDecode } from "jwt-decode";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { LogInIcon, LogOutIcon } from "lucide-react";
import SignInDialog from "./sign-in-dialog";
import { useEffect, useState } from "react";

interface JwtPayload {
  username: string;
  exp: number;
}

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);
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
  }, []);

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
    <Card className="xl:px-32 lg:px-12">
      <CardContent className="flex flex-row items-center justify-between p-5">
        {/* Logo */}
        <Link href="/">
          <Image alt="ReelVault" src="/Logo.svg" height={36} width={130} priority />
        </Link>
        {/* Butão de abrir menu em tela mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            </SheetTrigger>

            <SidebarSheet />
          </Sheet>
        </div>
        {/* Barra de pesquisa */}
        <div className="hidden md:flex w-[300px] xl:w-[500px]">
            <Search />
        </div>

        <div className="hidden md:flex">
            <Link href="/">
                <Button variant="ghost" className="hidden md:inline-flex">
                    <Image alt="Voltar para o inicio" src="/icons/home.svg" width={16} height={16} />
                Home
                </Button>
            </Link>
            <Link href="/favorites">
                <Button variant="ghost" className="hidden md:inline-flex">
                    <Image alt="Favoritos" src="/icons/star.svg" width={16} height={16} />
                Favoritos
                </Button>
            </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {username ? (
            <>
              <span className="font-bold">Olá, {username}!</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("token");
                  setUsername(null);
                  window.dispatchEvent(new StorageEvent("storage", { key: "token" }));
                }}
              >
                <LogOutIcon />
              </Button>
            </>
          ) : (
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
              <DialogTrigger asChild>
                <Button size="default">
                  Login
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%]">
                <SignInDialog onLoginSuccess={handleLoginSuccess} />
              </DialogContent>
            </Dialog>
          )}
        </div>


      </CardContent>
    </Card>
  );
};

export default Header;
