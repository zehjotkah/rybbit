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
import { Safari } from "@/components/magicui/safari";
import { Integrations } from "./components/integrations";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { Logo } from "./components/Logo";

import { ShineBorder } from "@/components/magicui/shine-border";


const tilt_wrap = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
});

export default function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center overflow-x-hidden">

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

      <div className="relative w-full max-w-[1300px] mb-10 px-4">
        {/* Background gradients - adjusted to stay within container */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-600/30 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/3 right-0 w-[250px] h-[250px] bg-purple-600/30 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-1/3 left-0 w-[250px] h-[250px] bg-emerald-500/20 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl opacity-40"></div>

        {/* Iframe with border */}
        <div className="relative z-10 rounded-xl overflow-hidden border-2 border-neutral-600 shadow-2xl shadow-emerald-900/10">
          <iframe 
            src="https://tracking.tomato.gg/1" 
            width="1300" 
            height="750" 
            className="w-full"
            style={{ border: 'none' }}
            title="Rybbit Analytics Demo"
          ></iframe>
        </div>
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
          <UserProfiles />

          {/* Row 2 */}
          <UserSessions />
          <UserFlowAnalysis />
          <Funnels />

          {/* Row 3 */}
          <UserBehaviorTrends />
          <EventTracking />
          <GoalConversion />
        </div>
      </section>

      <Integrations />

      {/* add CTA section here */}
      <section className="py-24 w-full bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-neutral-800/60 backdrop-blur-sm border border-neutral-700 rounded-2xl shadow-xl overflow-hidden">
            {/* Background gradient accents */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative p-12 flex flex-col items-center justify-center text-center">
              <div className="mb-8">
              <Logo />
              </div>
              <h2 className="text-4xl font-bold mb-6">Ready to take control of your analytics?</h2>
              <p className="text-xl text-neutral-300 mb-10 max-w-3xl mx-auto">
                Join thousands of businesses that use Rybbit to make data-driven decisions without compromising on privacy or performance.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <Link href="https://tracking.tomato.gg/signup">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-4 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 w-full sm:w-auto">
                    Get Started for Free
                  </button>
                </Link>
                <Link href="https://docs.tomato.gg">
                  <button className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-8 py-4 rounded-lg border border-neutral-600 transform hover:-translate-y-0.5 transition-all duration-200 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50 w-full sm:w-auto">
                    View Documentation
                  </button>
                </Link>
              </div>
              
              <p className="text-neutral-400 text-sm flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                No credit card required. Free plan available for small projects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


