// useHashLocation.ts
import { useState, useEffect } from "react";

export function useHashLocation() {
  const hashToPath = (hash: string) => hash.replace(/^#/, "") || "/";
  const pathToHash = (path: string) => "#" + path;

  const [loc, setLoc] = useState(() => hashToPath(window.location.hash));

  useEffect(() => {
    const handler = () => setLoc(hashToPath(window.location.hash));
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = pathToHash(to);
  };

  return [loc, navigate] as const;
}
