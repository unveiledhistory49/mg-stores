import { MgWordmark } from "@/components/brand/mg-wordmark";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <MgWordmark className="scale-125" />
        <p className="max-w-md text-lg leading-8 text-stone-600">
          Everything you need. One store. Frontend build in progress.
        </p>
      </div>
    </main>
  );
}