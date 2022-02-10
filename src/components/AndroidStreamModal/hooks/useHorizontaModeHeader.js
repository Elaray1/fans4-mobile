import { useCallback, useRef, useEffect, useState } from 'react';

const CONTROLS_SHOWN_TIMEOUT = 2000;

const useHorizontalModeHeader = () => {
  const [isHorizontalModeHeaderShown, setIsHorizontalModeHeaderShown] = useState(true);

  const controlsShownTimeoutRef = useRef(null);

  const prolongControlsShowing = useCallback(() => {
    setIsHorizontalModeHeaderShown(true);
    clearInterval(controlsShownTimeoutRef.current);

    controlsShownTimeoutRef.current = setTimeout(() => {
      setIsHorizontalModeHeaderShown(false);
    }, CONTROLS_SHOWN_TIMEOUT);
  }, []);

  useEffect(() => {
    prolongControlsShowing();
  }, [prolongControlsShowing]);

  return { prolongControlsShowing, isHorizontalModeHeaderShown };
};

export default useHorizontalModeHeader;
