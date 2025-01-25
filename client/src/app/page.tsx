import { PageViews } from "./components/PageViews";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <PageViews />
      </div>
    </main>
  );
}
