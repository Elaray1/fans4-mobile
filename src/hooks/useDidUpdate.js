import { useEffect, useRef } from 'react';

export default function useDidUpdate(func, dependencies) {
  const isFirstRender = useRef(false);

  useEffect(() => {
    if (!isFirstRender.current) {
      isFirstRender.current = true;
    } else {
      func();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
}
