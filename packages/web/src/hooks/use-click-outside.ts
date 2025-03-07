import { useEffect } from "react";

type UseClickOutsideProps = {
  ref: React.RefObject<HTMLElement | null>;
  handler: (event: MouseEvent | TouchEvent) => void;
};

export function useClickOutside({ ref, handler }: UseClickOutsideProps) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      const element = ref.current;

      if (
        !element ||
        !(event.target instanceof Node) ||
        element.contains(event.target)
      ) {
        return;
      }

      handler(event);
    }

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
