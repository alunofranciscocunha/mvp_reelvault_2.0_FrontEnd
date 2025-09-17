import Header from "@/_components/header";
import SecondHeader from "@/_components/second-header";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="relative h-[80px] md:hidden">
        <SecondHeader />
      </div>
      <div className="flex flex-col md:flex-row-reverse md: flex-1 items-center justify-center md:gap-25">
        <div className="flex flex-col items-center justify-center text-center md:w-[400px]">
          <h1 className="text-8xl md:text-9xl font-bold text-secondary mb-5">
            404
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-5 w-[200px] md:w-[100%] text-wrap uppercase ">
            Página não encontrada!!
          </h2>
        </div>
        <Image
          src="/404FlatDesign.svg"
          width={300}
          height={300}
          alt="Imagem de um homem assistindo tv enquanto come pipoca"
          className="md:hidden"
        />
        <div className="hidden md:block">
          <Image
            src="/404FlatDesign.svg"
            width={450}
            height={450}
            alt="Imagem de um homem assistindo tv enquanto come pipoca"
          />
        </div>
      </div>
    </div>
  );
}
