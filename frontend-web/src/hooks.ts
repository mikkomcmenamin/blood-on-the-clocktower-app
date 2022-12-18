import { useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [ref, callback]);
}
