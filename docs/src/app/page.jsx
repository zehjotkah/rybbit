import { Tilt_Warp } from "next/font/google";
import { AdvancedFilters } from "./components/Cards/AdvancedFilters";
import { EventTracking } from "./components/Cards/EventTracking";
import { Funnels } from "./components/Cards/Funnels";
import { GoalConversion } from "./components/Cards/GoalConversion";
import { RealTimeAnalytics } from "./components/Cards/RealTimeAnalytics";
import { UserBehaviorTrends } from "./components/Cards/UserBehaviorTrends";
import { UserFlowAnalysis } from "./components/Cards/UserFlowAnalysis";
import { UserProfiles } from "./components/Cards/UserProfiles";
import { UserSessions } from "./components/Cards/UserSessions";


const tilt_wrap = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
});

export default function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className={`text-7xl font-semibold pt-24 px-4 tracking-tight max-w-3xl text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 ${tilt_wrap.className}`}>The Modern Google Analytics Alternative</h1>
      <h2 className="text-2xl pt-8 px-4 tracking-tight max-w-3xl text-center text-neutral-300">Open source web + product analytics for everyone</h2>

      <div className="flex my-10 items-center justify-center gap-4 text-2xl">
        <button className="bg-emerald-700 text-white px-5 py-3 rounded-lg">Track your Site</button>
        <button className="bg-white text-black px-5 py-3 rounded-lg">View Live Demo</button>
      </div>

      <div className="relative w-[1200px] mb-10">
        <img src="/main.jpg" alt="Analytics" className="object-cover w-full border-2 border-neutral-600 rounded-2xl" />
        <div className="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-t from-[#111111] to-transparent rounded-b-2xl"></div>
      </div>

      <section className="py-20 w-full max-w-7xl px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Row 1 */}
          <RealTimeAnalytics />
          <AdvancedFilters />
          <EventTracking />

          {/* Row 2 */}
          <UserProfiles />
          <UserFlowAnalysis />
          <GoalConversion />

          {/* Row 3 */}
          <UserBehaviorTrends />
          <Funnels />
          <UserSessions />
        </div>
      </section>
    </div>
  )
}


