"use client"
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SidebarSheet from "./sidebar-sheet";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger } from "./ui/sheet";

export default function SecondHeader() {
  const router = useRouter();
  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="absolute z-1 left-4 top-4 border-none"
        onClick={() => router.back()}
      >
        <ChevronLeftIcon />
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="absolute z-1 right-4 top-4 border-none"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SidebarSheet />
      </Sheet>
    </>
  );
}
