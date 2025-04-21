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
import Link from "next/link";

const tilt_wrap = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
});

export default function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className={`text-7xl font-semibold pt-24 px-4 tracking-tight max-w-3xl text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 ${tilt_wrap.className}`}>The Modern Google Analytics Alternative</h1>
      <h2 className="text-2xl pt-8 px-4 tracking-tight max-w-3xl text-center text-neutral-300">Open source web + product analytics for everyone</h2>

      <div className="flex my-10 items-center justify-center gap-6 text-lg">
        <Link href="https://tracking.tomato.gg/signup">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3.5 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
            Track your Site
          </button>
        </Link>
        <Link href="https://tracking.tomato.gg/1">
          <button className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-6 py-3.5 rounded-lg border border-neutral-600 transform hover:-translate-y-0.5 transition-all duration-200 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50">
            View Live Demo
          </button>
        </Link>
      </div>

      <div className="relative w-[1200px] mb-10">
        <img src="/main.jpg" alt="Analytics" className="object-cover w-full border-2 border-neutral-600 rounded-2xl" />
        <div className="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-t from-[#111111] to-transparent rounded-b-2xl"></div>
      </div>

      <section className="py-20 w-full max-w-7xl px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Analytics Reimagined
          </div>
          <h2 className="text-5xl font-bold tracking-tight">Features</h2>
          <p className="mt-4 text-xl text-neutral-300 max-w-2xl mx-auto">
            Everything you need to understand your audience and grow your business, without the complexity.
          </p>
        </div>
        
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


