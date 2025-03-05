import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  function handleChange(event: MediaQueryListEvent) {
    setMatches(event.matches);
  }

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
