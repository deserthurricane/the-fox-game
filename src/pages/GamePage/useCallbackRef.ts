import { useCallback, useState } from "react";

export function useCallbackRef() {
  const [ref, setRef] = useState<HTMLElement>();

  const getCallbackRef = useCallback((node: HTMLElement) => {
    if (node) {
      console.log(node, 'node');
      
      setRef(node);
    } else {
      setRef(undefined);
    }
  }, []);

  return [ref, getCallbackRef];
}