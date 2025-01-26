import { Header } from "./components/Header/Header";
import { MainSection } from "./components/MainSection/MainSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-6xl">
        <Header />
        <MainSection />
      </div>
    </main>
  );
}
