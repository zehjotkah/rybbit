import { useEffect } from "react";

export const useSuppressReferrer = () => {
  useEffect(() => {
    // Check if a referrer meta tag already exists
    let meta = document.querySelector('meta[name="referrer"]') as HTMLMetaElement;
    const previousContent = meta ? meta.getAttribute("content") : null;
    let created = false;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "referrer";
      document.head.appendChild(meta);
      created = true;
    }

    // Set the policy to 'no-referrer' to bypass hotlink protection
    meta.content = "no-referrer";

    // Cleanup function to restore original state
    return () => {
      if (created) {
        document.head.removeChild(meta);
      } else if (previousContent) {
        meta.content = previousContent;
      }
    };
  }, []);
};