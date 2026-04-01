import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates signed URLs for private storage bucket files.
 * Returns a map of path -> signedUrl, refreshed when paths change.
 */
export function useSignedUrls(bucket: string, paths: string[], expiresIn = 3600) {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!paths || paths.length === 0) {
      setUrls({});
      return;
    }

    let cancelled = false;

    const generate = async () => {
      const result: Record<string, string> = {};
      for (const path of paths) {
        const { data } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
        if (data?.signedUrl) result[path] = data.signedUrl;
      }
      if (!cancelled) setUrls(result);
    };

    generate();
    return () => { cancelled = true; };
  }, [bucket, JSON.stringify(paths), expiresIn]);

  return urls;
}
