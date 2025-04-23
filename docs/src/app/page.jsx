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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShineBorder } from "@/components/magicui/shine-border";


const tilt_wrap = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
});

export default function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center overflow-x-hidden">

      <h1 className={`text-4xl md:text-5xl lg:text-7xl font-semibold pt-16 md:pt-24 px-4 tracking-tight max-w-3xl text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 ${tilt_wrap.className}`}>The Modern Google Analytics Alternative</h1>
      <h2 className="text-lg md:text-2xl pt-4 md:pt-6 px-4 tracking-tight max-w-3xl text-center text-neutral-300">Next-gen, open source, lightweight, cookieless web & product analytics for everyone — GDPR/CCPA compliant.</h2>

      <div className="flex flex-col sm:flex-row my-8 md:my-10 items-center justify-center gap-4 md:gap-6 text-base md:text-lg px-4">
        <Link href="https://tracking.tomato.gg/signup" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-3 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
            Track your Site
          </button>
        </Link>
        <Link href="https://tracking.tomato.gg/1" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-5 py-3 rounded-lg border border-neutral-600 transform hover:-translate-y-0.5 transition-all duration-200 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50">
            View Live Demo
          </button>
        </Link>
      </div>

      <div className="relative w-full max-w-[1300px] mb-10 px-4">
        {/* Background gradients - overlapping circles for organic feel */}
        <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-emerald-500/40 rounded-full blur-[80px] opacity-70"></div>
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-emerald-600/30 rounded-full blur-[70px] opacity-50"></div>
        
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/40 rounded-full blur-[80px] opacity-60"></div>
        <div className="absolute bottom-40 right-20 w-[350px] h-[350px] bg-indigo-500/30 rounded-full blur-[75px] opacity-50"></div>
        
        <div className="absolute top-1/4 right-0 w-[320px] h-[320px] bg-purple-500/40 rounded-full blur-[70px] opacity-50"></div>
        <div className="absolute top-1/3 right-20 w-[250px] h-[250px] bg-violet-500/30 rounded-full blur-[65px] opacity-40"></div>
        
        <div className="absolute bottom-1/3 left-0 w-[320px] h-[320px] bg-emerald-400/30 rounded-full blur-[70px] opacity-60"></div>
        <div className="absolute bottom-1/4 left-20 w-[240px] h-[240px] bg-teal-400/25 rounded-full blur-[65px] opacity-50"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-400/30 rounded-full blur-[80px] opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3 w-[350px] h-[350px] bg-sky-400/20 rounded-full blur-[75px] opacity-40"></div>

        {/* Iframe container with responsive visibility */}
        <div className="relative z-10 rounded-lg overflow-hidden border-4 border-neutral-100/5 shadow-2xl shadow-emerald-900/10">
          {/* Remove mobile message and show iframe on all devices */}
          <iframe 
            src="https://tracking.tomato.gg/1" 
            width="1300" 
            height="750" 
            className="w-full h-[600px] md:h-[700px] lg:h-[750px]"
            style={{ border: 'none' }}
            title="Rybbit Analytics Demo"
          ></iframe>
        </div>
      </div>
      
      <section className="py-14 md:py-20 w-full max-w-7xl px-4">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Analytics Reimagined
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Features</h2>
          <p className="mt-4 text-base md:text-xl text-neutral-300 max-w-2xl mx-auto">
            Everything you need to understand your audience and grow your business, without the complexity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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


      {/* Testimonial Section */}
      <section className="py-10 md:py-16 w-full">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-neutral-800/20 backdrop-blur-sm border border-neutral-700 rounded-xl shadow-lg overflow-hidden">
            {/* Background glow effects - toned down */}
            <div className="absolute -right-40 -top-40 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            
            {/* Quote mark - smaller */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 text-6xl md:text-7xl leading-none font-serif text-emerald-600/25">"</div>
            
            {/* Testimonial content */}
            <div className="relative z-10 p-6 md:p-10 text-center">
              <p className="text-lg md:text-2xl font-medium mb-6 text-white mx-auto max-w-2xl leading-relaxed">
                Rybbit has completely transformed how we understand our users. The real-time data is incredible, and I've finally ditched Google Analytics for something that respects privacy.
              </p>
              
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-emerald-500/10 blur-sm rounded-full"></div>
                <div className="relative bg-neutral-900/60 backdrop-blur-sm border border-neutral-700 rounded-full px-5 py-2">
                  <p className="font-semibold text-white">Chris Weaver</p>
                  <p className="text-sm text-neutral-400">CEO at Oynx AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Integrations />
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Common Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
              Everything you need to know about Rybbit Analytics
            </p>
          </div>
          
          <div className="bg-neutral-800/20 backdrop-blur-sm border border-neutral-700 rounded-xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-neutral-700/50">
                <AccordionTrigger className="px-6 py-4 text-base md:text-lg font-medium hover:text-emerald-400 transition-colors">
                  Is Rybbit GDPR and CCPA compliant?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-neutral-300">
                  Yes, Rybbit is fully compliant with GDPR, CCPA, and other privacy regulations. We don't use cookies or collect any personal data that could identify your users. We prioritize privacy by design while still giving you all the analytics you need.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-neutral-700/50">
                <AccordionTrigger className="px-6 py-4 text-base md:text-lg font-medium hover:text-emerald-400 transition-colors">
                  How does Rybbit compare to Google Analytics?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-neutral-300">
                  Unlike Google Analytics, Rybbit provides a clean, intuitive interface that's easy to use. We focus on the metrics that matter most, without overwhelming you with too many options. Plus, we respect user privacy, don't slow down your site, and offer first-party data collection.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-neutral-700/50">
                <AccordionTrigger className="px-6 py-4 text-base md:text-lg font-medium hover:text-emerald-400 transition-colors">
                  Can I self-host Rybbit?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-neutral-300">
                  Absolutely! Rybbit is available as a self-hosted option. You can install it on your own server and have complete control over your data. We also offer a cloud version if you prefer a managed solution.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b border-neutral-700/50">
                <AccordionTrigger className="px-6 py-4 text-base md:text-lg font-medium hover:text-emerald-400 transition-colors">
                  How easy is it to set up Rybbit?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-neutral-300">
                  Setting up Rybbit is incredibly simple. Just add a small script to your website, and you're good to go. Most users are up and running in less than 5 minutes. We also provide comprehensive documentation and support if you need any help.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="px-6 py-4 text-base md:text-lg font-medium hover:text-emerald-400 transition-colors">
                  What platforms does Rybbit support?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-neutral-300">
                  Rybbit works with virtually any website platform. Whether you're using WordPress, Shopify, Next.js, React, Vue, or any other framework, our simple tracking snippet integrates seamlessly. We also offer specialized plugins for popular platforms to make integration even easier.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* add CTA section here */}
      <section className="py-16 md:py-24 w-full bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-neutral-800/60 backdrop-blur-sm border border-neutral-700 rounded-2xl shadow-xl overflow-hidden">
            {/* Background gradient accents */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative p-6 md:p-12 flex flex-col items-center justify-center text-center">
              <div className="mb-6 md:mb-8">
                <Logo />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Ready to take control of your analytics?</h2>
              <p className="text-base md:text-xl text-neutral-300 mb-6 md:mb-10 max-w-3xl mx-auto">
                Join thousands of businesses that use Rybbit to make data-driven decisions without compromising on privacy or performance.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8 w-full sm:w-auto">
                <Link href="https://tracking.tomato.gg/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                    Get Started for Free
                  </button>
                </Link>
                <Link href="https://docs.tomato.gg" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-6 md:px-8 py-3 md:py-4 rounded-lg border border-neutral-600 transform hover:-translate-y-0.5 transition-all duration-200 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50">
                    View Documentation
                  </button>
                </Link>
              </div>
              
              <p className="text-neutral-400 text-xs md:text-sm flex items-center justify-center gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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


