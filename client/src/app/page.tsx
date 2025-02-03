import { Header } from "./components/Header/Header";
import { MainSection } from "./components/MainSection/MainSection";
import { Browsers } from "./components/sections/Browsers/Browsers";
import { Countries } from "./components/sections/Countries/Countries";
import { Devices } from "./components/sections/Devices/Devices";
import { OperatingSystems } from "./components/sections/OperatingSystems/OperatingSystems";
import { Pages } from "./components/sections/Pages/Pages";
import { Referrers } from "./components/sections/Referrers/Referrers";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-6xl">
        <Header />
        <MainSection />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <OperatingSystems />
          <Browsers />
          <Devices />
          <Pages />
          <Referrers />
          <Countries />
        </div>
      </div>
    </main>
  );
}
