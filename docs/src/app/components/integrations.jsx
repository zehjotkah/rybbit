import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";

// Platform logos from the public directory
const platforms = [
  { name: "Next.js", logo: "/platforms/nextjs.svg" },
  { name: "React", logo: "/platforms/react.svg" },
  { name: "Vue", logo: "/platforms/vue.svg" },
  { name: "Angular", logo: "/platforms/angular.svg" },
  { name: "Svelte", logo: "/platforms/svelte.svg" },
  { name: "Remix", logo: "/platforms/remix.png" },
  { name: "Gatsby", logo: "/platforms/gatsby.svg" },
  { name: "Nuxt", logo: "/platforms/nuxt.svg" },
  { name: "WordPress", logo: "/platforms/wordpress.svg" },
  { name: "Shopify", logo: "/platforms/shopify.svg" },
  { name: "Webflow", logo: "/platforms/webflow.svg" },
  { name: "Laravel", logo: "/platforms/laravel.svg" },
  { name: "GTM", logo: "/platforms/gtm.svg" },
  { name: "Next.js", logo: "/platforms/nextjs.svg" },
  { name: "React", logo: "/platforms/react.svg" },
  { name: "Vue", logo: "/platforms/vue.svg" },
  { name: "Angular", logo: "/platforms/angular.svg" },
  { name: "Svelte", logo: "/platforms/svelte.svg" },
  { name: "Remix", logo: "/platforms/remix.png" },
  { name: "Gatsby", logo: "/platforms/gatsby.svg" },
  { name: "Nuxt", logo: "/platforms/nuxt.svg" },
  { name: "WordPress", logo: "/platforms/wordpress.svg" },
  { name: "Shopify", logo: "/platforms/shopify.svg" },
  { name: "Webflow", logo: "/platforms/webflow.svg" },
  { name: "Laravel", logo: "/platforms/laravel.svg" },
  { name: "GTM", logo: "/platforms/gtm.svg" },
  { name: "Next.js", logo: "/platforms/nextjs.svg" },
  { name: "React", logo: "/platforms/react.svg" },
  { name: "Vue", logo: "/platforms/vue.svg" },
  { name: "Angular", logo: "/platforms/angular.svg" },
  { name: "Svelte", logo: "/platforms/svelte.svg" },
  { name: "Remix", logo: "/platforms/remix.png" },
  { name: "Gatsby", logo: "/platforms/gatsby.svg" },
  { name: "Nuxt", logo: "/platforms/nuxt.svg" },
  { name: "WordPress", logo: "/platforms/wordpress.svg" },
  { name: "Shopify", logo: "/platforms/shopify.svg" },
  { name: "Webflow", logo: "/platforms/webflow.svg" },
  { name: "Laravel", logo: "/platforms/laravel.svg" },
  { name: "GTM", logo: "/platforms/gtm.svg" },
];

// Split into two rows for the marquee effect
const firstRow = platforms.slice(0, Math.ceil(platforms.length / 2));
const secondRow = platforms.slice(Math.ceil(platforms.length / 2));

const PlatformLogo = ({ name, logo }) => {
  return (
    <div className={cn(
      "flex items-center justify-center h-20 w-20 mx-2 my-2", 
      "bg-neutral-800/40 backdrop-blur-sm rounded-lg p-4",
      "border border-neutral-700 hover:border-neutral-500 transition-colors duration-200"
    )}>
      <Image 
        src={logo} 
        alt={name} 
        width={60} 
        height={60} 
        className="object-contain max-h-10" 
      />
    </div>
  );
};

export function Integrations() {
  return (
    <div className="py-20 w-full">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <div className="inline-block bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
          Seamless Integration
        </div>
        <h2 className="text-4xl font-bold mb-3">Works with all your favorite platforms</h2>
        <p className="text-xl text-neutral-300">
          Integrate Rybbit with any platform in minutes
        </p>
      </div>
    
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-8">
        <Marquee pauseOnHover className="[--duration:120s]" reverse>
          {firstRow.map((platform, index) => (
            <PlatformLogo key={index} {...platform} />
          ))}
        </Marquee>
        
        <Marquee pauseOnHover className="[--duration:90s]">
          {secondRow.map((platform, index) => (
            <PlatformLogo key={index} {...platform} />
          ))}
        </Marquee>
        
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  );
}
