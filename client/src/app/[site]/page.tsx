import { redirect } from "next/navigation";
import { Suspense } from "react";

// Temporary loading component that will show while the redirect is processing
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

// This is now a Server Component (no "use client" directive)
export default function SiteRedirect({ params }: { params: { site: string } }) {
  const siteId = params.site;

  if (siteId) {
    // Server-side redirect using Next.js redirect function
    redirect(`/${siteId}/main`);
  }

  // This code will not execute if redirect is successful
  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Redirect Failed</h1>
          <p className="mb-4">Unable to navigate to the dashboard.</p>
          {siteId && (
            <a
              href={`/${siteId}/main`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
            >
              Go to Dashboard
            </a>
          )}
        </div>
      </div>
    </Suspense>
  );
}
