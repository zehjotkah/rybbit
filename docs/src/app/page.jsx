import Image from "next/image";
import {
  AppWindow,
  Brain,
  FileText,
  FolderInput,
  Globe,
  Languages,
  LogIn,
  LogOut,
  MapPinHouse,
  MapPinned,
  Maximize,
  MousePointerClick,
  Radio,
  Search,
  Share2,
  TabletSmartphone,
  Compass,
  Clock,
  Phone,
  Smartphone,
  Laptop,
} from "lucide-react";
import { CountryFlag } from "./components/Country";
import { Browser } from "./components/Browser";
import { OperatingSystem } from "./components/OperatingSystem";
import { Tilt_Warp } from "next/font/google";

 const FilterOptions = [
  {
    label: "Path",
    value: "pathname",
    icon: <FolderInput className="h-4 w-4" />,
  },
  {
    label: "Page Title",
    value: "page_title",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    label: "Query",
    value: "querystring",
    icon: <Search className="h-4 w-4" />,
  },
  {
    label: "Event Name",
    value: "event_name",
    icon: <MousePointerClick className="h-4 w-4" />,
  },
  {
    label: "Referrer",
    value: "referrer",
    icon: <Share2 className="h-4 w-4" />,
  },
  {
    label: "Channel",
    value: "channel",
    icon: <Radio className="h-4 w-4" />,
  },
  {
    label: "Entry Page",
    value: "entry_page",
    icon: <LogIn className="h-4 w-4" />,
  },
  {
    label: "Exit Page",
    value: "exit_page",
    icon: <LogOut className="h-4 w-4" />,
  },
  {
    label: "Country",
    value: "country",
    icon: <Globe className="h-4 w-4" />,
  },
  {
    label: "Region",
    value: "region",
    icon: <MapPinned className="h-4 w-4" />,
  },
  {
    label: "City",
    value: "city",
    icon: <MapPinHouse className="h-4 w-4" />,
  },
  {
    label: "Device Type",
    value: "device_type",
    icon: <TabletSmartphone className="h-4 w-4" />,
  },
  {
    label: "Operating System",
    value: "operating_system",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    label: "Browser",
    value: "browser",
    icon: <AppWindow className="h-4 w-4" />,
  },
  {
    label: "Language",
    value: "language",
    icon: <Languages className="h-4 w-4" />,
  },
  {
    label: "Screen Dimensions",
    value: "dimensions",
    icon: <Maximize className="h-4 w-4" />,
  },
];

// Mock events for the real-time analytics card
const mockEvents = [
  {
    id: 1,
    type: "pageview",
    pathname: "/pricing",
    timestamp: "2 min ago",
    country: "US",
    browser: "Chrome",
    operating_system: "Windows",
    device_type: "Desktop"
  },
  {
    id: 2,
    type: "event",
    event_name: "button_click",
    pathname: "/features",
    timestamp: "45 sec ago",
    country: "GB",
    browser: "Safari",
    operating_system: "macOS",
    device_type: "Desktop"
  },
  {
    id: 3,
    type: "pageview",
    pathname: "/blog/analytics-tips",
    timestamp: "just now",
    country: "DE",
    browser: "Firefox",
    operating_system: "Linux",
    device_type: "Mobile"
  }
];

// EventCard component for Real-time Analytics
function EventCard({ event }) {
  const isPageview = event.type === "pageview";
  
  return (
    <div className="mb-3 rounded-lg bg-neutral-800/50 border border-neutral-700 overflow-hidden p-3 flex flex-col">
      <div className="flex items-center gap-2 text-sm text-neutral-100 mb-2">
        <div className="flex items-center gap-2">
          {isPageview ? (
            <FileText className="w-4 h-4 text-blue-500" />
          ) : (
            <MousePointerClick className="w-4 h-4 text-amber-500" />
          )}
        </div>

        <div>
          {isPageview ? event.pathname : event.event_name}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex space-x-2 items-center ml-6">
          <div className="flex items-center">
            <CountryFlag country={event.country} />
          </div>
          <div>
            <Browser browser={event.browser || "Unknown"} />
          </div>
          <div>
            <OperatingSystem os={event.operating_system || ""} />
          </div>
          <div>
           {event.device_type === "Mobile" ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
          </div>
        </div>

        <div className="ml-auto flex items-center text-xs text-neutral-400">
          <Clock className="w-3 h-3 mr-1" />
          <span>{event.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

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
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
            <p className="text-neutral-300 mb-4">See your site performance as it happens with instant data updates and live visitor activity.</p>
            
            <div className="bg-neutral-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Live Visitors</h4>
                <span className="bg-emerald-500/20 text-emerald-400 font-medium px-2 py-1 rounded text-sm">28 online</span>
              </div>
              
              <div className="space-y-1">
                {mockEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">Advanced Filters</h3>
            <p className="text-neutral-300">Drill down into your data with advanced filters across over a dozen dimensions.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">  
              {FilterOptions.map((option) => (
                <div key={option.value} className="flex items-center  gap-2 text-base bg-neutral-800 border border-neutral-700 py-1 px-2 rounded-md">
                  {option.icon}
                  {option.label}
                </div>
              ))}
            </div>
            {/* <p className="text-neutral-300">Create personalized views of your data with drag-and-drop widgets and custom metrics.</p> */}
          </div>

          {/* Row 2 */}
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">Event Tracking</h3>
            <p className="text-neutral-300">Monitor user interactions with your site including clicks, form submissions, and custom events.</p>
            <div className="mt-4 bg-neutral-900 p-4 rounded-md">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                <span className="font-semibold text-emerald-400">button_click</span>
                <span className="text-xs text-neutral-400 ml-auto">2023-11-15 14:32:07</span>
              </div>
              <div className="space-y-2">
                <div className="flex bg-neutral-800 p-2 rounded">
                  <span className="text-neutral-400 text-sm w-28">button_id</span>
                  <span className="text-white text-sm ml-2 font-medium">signup-cta</span>
                </div>
                <div className="flex bg-neutral-800 p-2 rounded">
                  <span className="text-neutral-400 text-sm w-28">page_section</span>
                  <span className="text-white text-sm ml-2 font-medium">hero</span>
                </div>
                <div className="flex bg-neutral-800 p-2 rounded">
                  <span className="text-neutral-400 text-sm w-28">user_segment</span>
                  <span className="text-white text-sm ml-2 font-medium">new_visitor</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">User Profiles</h3>
            <p className="text-neutral-300">Know who your users are and exactly what they do.</p>
            
            <div className="mt-4 bg-neutral-900 p-4 rounded-md">
              <div className="flex items-start gap-4">
                {/* User basic info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <div className="font-medium">User #8a4f3d7e</div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <CountryFlag country="US" />
                        <OperatingSystem os="macOS" />
                        <Browser browser="Chrome" />
                        <Laptop className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-neutral-800/50 p-2 rounded-md">
                      <div className="text-xs text-neutral-400">First seen</div>
                      <div className="text-sm">Jan 12, 2023</div>
                    </div>
                    <div className="bg-neutral-800/50 p-2 rounded-md">
                      <div className="text-xs text-neutral-400">Last seen</div>
                      <div className="text-sm">Today, 2:34 PM</div>
                    </div>
                    <div className="bg-neutral-800/50 p-2 rounded-md">
                      <div className="text-xs text-neutral-400">Sessions</div>
                      <div className="text-sm font-medium">48</div>
                    </div>
                    <div className="bg-neutral-800/50 p-2 rounded-md">
                      <div className="text-xs text-neutral-400">Pageviews</div>
                      <div className="text-sm font-medium">134</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activity calendar grid */}
              <div className="mt-4">
                <div className="text-xs text-neutral-400 mb-2">Activity</div>
                <div className="flex gap-1">
                  {/* Column labels (months) */}
                  <div className="flex flex-col gap-1 justify-end pr-1">
                    <div className="text-[9px] text-neutral-500">Jan</div>
                    <div className="text-[9px] text-neutral-500">Feb</div>
                    <div className="text-[9px] text-neutral-500">Mar</div>
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-18 gap-1">
                    {Array(54).fill().map((_, i) => {
                      // Randomly determine activity level (0-4)
                      const activityLevel = Math.floor(Math.random() * 5);
                      
                      // Set color based on activity level
                      let bgColor = 'bg-neutral-800';
                      if (activityLevel === 1) bgColor = 'bg-emerald-900';
                      if (activityLevel === 2) bgColor = 'bg-emerald-800';
                      if (activityLevel === 3) bgColor = 'bg-emerald-700';
                      if (activityLevel === 4) bgColor = 'bg-emerald-600';
                      
                      return (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-sm ${bgColor}`}
                          title={`${activityLevel} visits`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">Privacy-focused</h3>
            <p className="text-neutral-300">No cookies, no personal data collection, and GDPR and CCPA compliant analytics for your peace of mind.</p>
            <div className="flex items-center gap-2 justify-center"> 
              <Image src="/eu.svg" alt="Privacy" width={200} height={200} />
            </div>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">User Flow Analysis</h3>
            <p className="text-neutral-300 mb-4">Visualize how users navigate through your site with intuitive path analysis tools.</p>
            
            <div className="mt-4 bg-neutral-900 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <div className="text-base font-medium">Homepage Flow</div>
                <div className="bg-blue-900/30 text-blue-400 text-sm px-2 py-1 rounded-md">
                  1,240 users
                </div>
              </div>
              
              {/* Flow diagram - structured approach */}
              <div className="relative py-2">
                {/* Entry point - full width, no line */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Entry Page</span>
                    <span className="text-xs text-neutral-400">100%</span>
                  </div>
                  <div className="w-full py-3 px-2 bg-emerald-900/30 border border-emerald-500/40 rounded-md text-center text-sm">
                    Homepage
                  </div>
                </div>
                
                {/* Second level - split */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Second Page</span>
                    <span className="text-xs text-neutral-400">73% continued</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="flex flex-col">
                      <div className="py-3 px-2 bg-blue-900/30 border border-blue-500/40 rounded-md text-center text-sm mb-2">
                        Products
                      </div>
                      <div className="text-xs text-center text-blue-400">42%</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="py-3 px-2 bg-blue-900/30 border border-blue-500/40 rounded-md text-center text-sm mb-2">
                        Features
                      </div>
                      <div className="text-xs text-center text-blue-400">31%</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="py-3 px-2 bg-neutral-800 border border-neutral-700 rounded-md text-center text-neutral-500 text-sm mb-2">
                        Other
                      </div>
                      <div className="text-xs text-center text-neutral-500">27%</div>
                    </div>
                  </div>
                </div>
                
                {/* Third level - conversion */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Conversion Pages</span>
                    <span className="text-xs text-neutral-400">32% converted</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="flex flex-col">
                      <div className="py-3 px-2 bg-orange-900/30 border border-orange-500/40 rounded-md text-center text-sm mb-2">
                        Checkout
                      </div>
                      <div className="text-xs text-center text-orange-400">15%</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="py-3 px-2 bg-orange-900/30 border border-orange-500/40 rounded-md text-center text-sm mb-2">
                        Sign Up
                      </div>
                      <div className="text-xs text-center text-orange-400">17%</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="py-3 px-2 bg-neutral-800 border border-neutral-700 rounded-md text-center text-neutral-500 text-sm mb-2">
                        Exit
                      </div>
                      <div className="text-xs text-center text-neutral-500">68%</div>
                    </div>
                  </div>
                </div>
                
                {/* Connecting lines using pseudo elements and CSS are better,
                     but this simplified approach works for the mockup */}
                
                <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none hidden md:block" aria-hidden="true">
                  {/* Connecting guides - would be better with SVG in a real implementation */}
                  <div className="absolute top-14 left-16 h-[calc(100%-120px)] w-px bg-neutral-800"></div>
                  <div className="absolute top-14 left-1/2 h-[calc(100%-120px)] w-px bg-neutral-800"></div>
                  <div className="absolute top-14 right-16 h-[calc(100%-120px)] w-px bg-neutral-800"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">Goal Conversion</h3>
            <p className="text-neutral-300">Set up and track conversion goals to measure the success of your key objectives.</p>
            <div className="mt-4 bg-neutral-900 p-4 rounded-md">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Newsletter Signup</span>
                    <span className="text-emerald-400 text-sm font-bold">8.7%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '8.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Free Trial Registration</span>
                    <span className="text-emerald-400 text-sm font-bold">12.4%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '12.4%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Product Purchase</span>
                    <span className="text-emerald-400 text-sm font-bold">3.2%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '3.2%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Support Contact</span>
                    <span className="text-emerald-400 text-sm font-bold">5.8%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '5.8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">Stunning Visualizations</h3>
            <p className="text-neutral-300">Bring your data to life in entirety new ways.</p>
            <div className="flex items-center gap-2 justify-center"> 
              <Image src="/globe.jpg" alt="Visualizations" width={200} height={200} />
            </div>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">User Behavior Trends</h3>
            <p className="text-neutral-300 mb-4">Discover when your users are most active with hourly and daily heatmaps.</p>
            
            <div className="mt-4 bg-neutral-900 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <div className="text-base font-medium">Weekly Activity Heatmap</div>
                <div className="bg-indigo-900/30 text-indigo-400 text-sm px-2 py-1 rounded-md">
                  Unique Visitors
                </div>
              </div>
              
              {/* Simplified Weekdays Heatmap */}
              <div className="flex mt-2">
                {/* Hours column */}
                <div className="w-10 flex-shrink-0">
                  <div className="h-5"></div> {/* Empty space for top row with day labels */}
                  {[0, 6, 12, 18].map(hour => (
                    <div key={hour} className="h-4 text-xs flex items-center justify-end pr-2 text-neutral-400 my-2">
                      {hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour-12}pm` : `${hour}am`}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap grid */}
                <div className="flex-1">
                  {/* Day labels */}
                  <div className="flex h-5">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={i} className="flex-1 text-center text-xs text-neutral-400">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Heatmap cells - generating a static pattern */}
                  <div className="grid grid-rows-4 gap-2 mt-1">
                    {/* Morning hours */}
                    <div className="flex h-4">
                      {[
                        { bg: 'rgba(99, 102, 241, 0.1)' },
                        { bg: 'rgba(99, 102, 241, 0.2)' },
                        { bg: 'rgba(99, 102, 241, 0.3)' },
                        { bg: 'rgba(99, 102, 241, 0.4)' },
                        { bg: 'rgba(99, 102, 241, 0.3)' },
                        { bg: 'rgba(99, 102, 241, 0.1)' },
                        { bg: 'rgba(99, 102, 241, 0.1)' }
                      ].map((style, i) => (
                        <div key={i} style={{ backgroundColor: style.bg }} className="flex-1 mx-0.5 rounded-sm my-0.5"></div>
                      ))}
                    </div>
                    
                    {/* Midday hours */}
                    <div className="flex h-4">
                      {[
                        { bg: 'rgba(99, 102, 241, 0.6)' },
                        { bg: 'rgba(99, 102, 241, 0.7)' },
                        { bg: 'rgba(99, 102, 241, 0.8)' },
                        { bg: 'rgba(99, 102, 241, 0.9)' },
                        { bg: 'rgba(99, 102, 241, 0.8)' },
                        { bg: 'rgba(99, 102, 241, 0.5)' },
                        { bg: 'rgba(99, 102, 241, 0.4)' }
                      ].map((style, i) => (
                        <div key={i} style={{ backgroundColor: style.bg }} className="flex-1 mx-0.5 rounded-sm my-0.5"></div>
                      ))}
                    </div>
                    
                    {/* Afternoon hours */}
                    <div className="flex h-4">
                      {[
                        { bg: 'rgba(99, 102, 241, 0.9)' },
                        { bg: 'rgba(99, 102, 241, 1.0)' },
                        { bg: 'rgba(99, 102, 241, 0.9)' },
                        { bg: 'rgba(99, 102, 241, 0.8)' },
                        { bg: 'rgba(99, 102, 241, 0.9)' },
                        { bg: 'rgba(99, 102, 241, 0.7)' },
                        { bg: 'rgba(99, 102, 241, 0.5)' }
                      ].map((style, i) => (
                        <div key={i} style={{ backgroundColor: style.bg }} className="flex-1 mx-0.5 rounded-sm my-0.5"></div>
                      ))}
                    </div>
                    
                    {/* Evening hours */}
                    <div className="flex h-4">
                      {[
                        { bg: 'rgba(99, 102, 241, 0.5)' },
                        { bg: 'rgba(99, 102, 241, 0.6)' },
                        { bg: 'rgba(99, 102, 241, 0.5)' },
                        { bg: 'rgba(99, 102, 241, 0.4)' },
                        { bg: 'rgba(99, 102, 241, 0.6)' },
                        { bg: 'rgba(99, 102, 241, 0.8)' },
                        { bg: 'rgba(99, 102, 241, 0.7)' }
                      ].map((style, i) => (
                        <div key={i} style={{ backgroundColor: style.bg }} className="flex-1 mx-0.5 rounded-sm my-0.5"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-5 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }} className="w-3 h-3 rounded-sm"></div>
                  <span className="text-xs text-neutral-400">Low</span>
                </div>
                <div className="mx-2 w-12 h-1" style={{ background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 1))' }}></div>
                <div className="flex items-center gap-1">
                  <div style={{ backgroundColor: 'rgba(99, 102, 241, 1)' }} className="w-3 h-3 rounded-sm"></div>
                  <span className="text-xs text-neutral-400">High</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-center text-neutral-500">
                Weekday afternoons show highest user engagement
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">Funnels</h3>
            <p className="text-neutral-300 mb-4">Visualize and analyze the path users take through your site to convert them.</p>
            
            <div className="mt-4 bg-neutral-900 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <div className="text-base font-medium">Sign-up Funnel</div>
                <div className="bg-emerald-900/30 text-emerald-400 text-sm px-2 py-1 rounded-md">
                  3.8% Conversion
                </div>
              </div>
              
              {/* Step 1 */}
              <div className="mb-6 relative">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex gap-2 items-center">
                    <div className="h-6 w-6 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center text-xs">1</div>
                    <span className="font-medium text-sm">Landing Page Visit</span>
                  </div>
                  <div className="text-sm text-neutral-300">5,274 users</div>
                </div>
                <div className="h-10 bg-blue-900/30 border border-blue-500/40 rounded-md w-full"></div>
                
                {/* Conversion arrow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-neutral-900 px-2 z-10 text-neutral-400 text-xs">
                  21.2% →
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="mb-6 relative">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex gap-2 items-center">
                    <div className="h-6 w-6 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center text-xs">2</div>
                    <span className="font-medium text-sm">Sign-up Form View</span>
                  </div>
                  <div className="text-sm text-neutral-300">1,118 users</div>
                </div>
                <div className="h-10 bg-blue-900/30 border border-blue-500/40 rounded-md mx-auto" style={{ width: '75%' }}></div>
                
                {/* Conversion arrow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-neutral-900 px-2 z-10 text-neutral-400 text-xs">
                  17.9% →
                </div>
              </div>
              
              {/* Step 3 */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex gap-2 items-center">
                    <div className="h-6 w-6 rounded-full bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center text-xs">3</div>
                    <span className="font-medium text-sm">Registration Complete</span>
                  </div>
                  <div className="text-sm text-neutral-300">200 users</div>
                </div>
                <div className="h-10 bg-emerald-900/30 border border-emerald-500/40 rounded-md mx-auto" style={{ width: '45%' }}></div>
              </div>
              
              <div className="mt-5 pt-3 border-t border-neutral-800 text-xs text-neutral-500">
                <div className="flex justify-between">
                  <span>Time period: Last 30 days</span>
                  <span>Step 1 → Step 3: 3.8% Overall</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">Open Source & Self-hostable</h3>
            <p className="text-neutral-300">Host Rybbit on your own VPS within minutes.</p>
            <div className="mt-4 bg-neutral-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
              <pre className="text-white">
{`user@vps:~$ git clone https://github.com/goldflag/rybbit.git
user@vps:~$ cd rybbit
user@vps:~$ ./setup.sh rybbit.io
`}
              </pre>
            </div>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-xl font-semibold mb-3">User Sessions</h3>
            <p className="text-neutral-300 mb-4">Track complete user journeys through your site with detailed session timelines.</p>
            
            <div className="mt-4 bg-neutral-900 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-sm font-medium">JD</div>
                  </div>
                  <div>
                    <div className="text-sm">Session #2c49ae3</div>
                    <div className="text-xs text-neutral-400">Today, 14:22 - 14:36 (14m)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CountryFlag country="US" />
                  <Browser browser="Chrome" />
                  <OperatingSystem os="macOS" />
                  <Laptop className="w-4 h-4" />
                </div>
              </div>
              
              <div className="flex gap-2 mb-3">
                <div className="flex items-center gap-1 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  <FileText className="w-3 h-3" />
                  <span>Pageviews: 5</span>
                </div>
                <div className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                  <MousePointerClick className="w-3 h-3" />
                  <span>Events: 2</span>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="px-1 py-2">
                {/* Event 1 */}
                <div className="flex mb-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute top-8 left-4 w-[1px] bg-neutral-700 h-[calc(100%-20px)]" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/30 border border-blue-500/50">
                      <span className="text-sm font-medium">1</span>
                    </div>
                  </div>

                  <div className="flex flex-col ml-3 flex-1">
                    <div className="flex items-center flex-1 py-1">
                      <FileText className="w-4 h-4 text-blue-500 mr-3" />
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm truncate">/home</div>
                      </div>
                      <div className="text-xs text-neutral-400">14:22:05</div>
                    </div>
                    <div className="flex items-center pl-7 mt-1">
                      <div className="text-xs text-neutral-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        1m 32s
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex mb-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute top-8 left-4 w-[1px] bg-neutral-700 h-[calc(100%-20px)]" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/30 border border-blue-500/50">
                      <span className="text-sm font-medium">2</span>
                    </div>
                  </div>

                  <div className="flex flex-col ml-3 flex-1">
                    <div className="flex items-center flex-1 py-1">
                      <FileText className="w-4 h-4 text-blue-500 mr-3" />
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm truncate">/features</div>
                      </div>
                      <div className="text-xs text-neutral-400">14:23:37</div>
                    </div>
                    <div className="flex items-center pl-7 mt-1">
                      <div className="text-xs text-neutral-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        2m 18s
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex mb-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute top-8 left-4 w-[1px] bg-neutral-700 h-[calc(100%-20px)]" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-900/30 border border-amber-500/50">
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </div>

                  <div className="flex flex-col ml-3 flex-1">
                    <div className="flex items-center flex-1 py-1">
                      <MousePointerClick className="w-4 h-4 text-amber-500 mr-3" />
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm truncate">button_click</div>
                      </div>
                      <div className="text-xs text-neutral-400">14:25:55</div>
                    </div>
                    <div className="flex items-center pl-7 mt-1">
                      <div className="flex flex-wrap gap-2">
                        <div className="px-1.5 py-0 h-5 text-xs bg-neutral-800 rounded border border-neutral-700">
                          <span className="text-neutral-400 font-light mr-1">button_id:</span>
                          <span>pricing-link</span>
                        </div>
                        <div className="px-1.5 py-0 h-5 text-xs bg-neutral-800 rounded border border-neutral-700">
                          <span className="text-neutral-400 font-light mr-1">section:</span>
                          <span>features</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="flex mb-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute top-8 left-4 w-[1px] bg-neutral-700 h-[calc(100%-20px)]" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/30 border border-blue-500/50">
                      <span className="text-sm font-medium">4</span>
                    </div>
                  </div>

                  <div className="flex flex-col ml-3 flex-1">
                    <div className="flex items-center flex-1 py-1">
                      <FileText className="w-4 h-4 text-blue-500 mr-3" />
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm truncate">/pricing</div>
                      </div>
                      <div className="text-xs text-neutral-400">14:25:58</div>
                    </div>
                    <div className="flex items-center pl-7 mt-1">
                      <div className="text-xs text-neutral-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        4m 42s
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event 5 */}
                <div className="flex mb-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute top-8 left-4 w-[1px] bg-neutral-700 h-[calc(100%-20px)]" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-900/30 border border-amber-500/50">
                      <span className="text-sm font-medium">5</span>
                    </div>
                  </div>

                  <div className="flex flex-col ml-3 flex-1">
                    <div className="flex items-center flex-1 py-1">
                      <MousePointerClick className="w-4 h-4 text-amber-500 mr-3" />
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm truncate">form_submit</div>
                      </div>
                      <div className="text-xs text-neutral-400">14:30:40</div>
                    </div>
                    <div className="flex items-center pl-7 mt-1">
                      <div className="flex flex-wrap gap-2">
                        <div className="px-1.5 py-0 h-5 text-xs bg-neutral-800 rounded border border-neutral-700">
                          <span className="text-neutral-400 font-light mr-1">form_id:</span>
                          <span>contact-form</span>
                        </div>
                        <div className="px-1.5 py-0 h-5 text-xs bg-neutral-800 rounded border border-neutral-700">
                          <span className="text-neutral-400 font-light mr-1">success:</span>
                          <span>true</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event 6 */}
                <div className="flex mb-3">
                  <div className="relative flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/30 border border-blue-500/50">
                      <span className="text-sm font-medium">6</span>
                    </div>
                  </div>

                  <div className="flex flex-col ml-3 flex-1">
                    <div className="flex items-center flex-1 py-1">
                      <FileText className="w-4 h-4 text-blue-500 mr-3" />
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm truncate">/thank-you</div>
                      </div>
                      <div className="text-xs text-neutral-400">14:30:42</div>
                    </div>
                    <div className="flex items-center pl-7 mt-1">
                      <div className="text-xs text-neutral-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        5m 18s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
