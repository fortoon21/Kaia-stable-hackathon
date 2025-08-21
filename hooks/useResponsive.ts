"use client";

import { useEffect, useState } from "react";

interface BreakpointFlags {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

export function useResponsive(): BreakpointFlags {
  const [breakpoints, setBreakpoints] = useState<BreakpointFlags>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
  });

  useEffect(() => {
    const checkBreakpoints = () => {
      const width = window.innerWidth;

      setBreakpoints({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024 && width < 1536,
        isLargeDesktop: width >= 1536,
      });
    };

    // Initial check
    checkBreakpoints();

    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkBreakpoints, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return breakpoints;
}

// Hook for media queries
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Initial check
    setMatches(media.matches);

    // Create listener
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Add listener (compatibility for older browsers)
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
