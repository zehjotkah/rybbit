import { useGetSite, useSiteHasData } from "../../../../api/admin/sites";
import { Alert } from "../../../../components/ui/alert";
import { useStore } from "../../../../lib/store";
import { CodeSnippet } from "../../../../components/CodeSnippet";
import { BACKEND_URL } from "../../../../lib/const";

export function NoData() {
  const { site } = useStore();
  const { data: siteHasData, isLoading } = useSiteHasData(site);
  const { data: siteMetadata, isLoading: isLoadingSiteMetadata } =
    useGetSite(site);

  if (!siteHasData && !isLoading && !isLoadingSiteMetadata) {
    return (
      <div className="m-4 mb-0">
        <Alert className="p-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
              <div className="font-medium">
                Waiting for analytics from {siteMetadata?.domain}...
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Place this snippet in the &lt;head&gt; of your website:
            </div>
            <CodeSnippet
              language="HTML"
              code={`<script\n    src="${BACKEND_URL}/script.js"\n    site-id="${siteMetadata?.siteId}"\n    defer\n></script>`}
              className="text-xs"
            />
          </div>
        </Alert>
      </div>
    );
  }

  return null;
}
