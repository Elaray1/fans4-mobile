import { useCallback, useRef, useEffect } from 'react';

const CONTROLS_SHOWN_TIMEOUT = 2000;

const useHorizontalModeHeader = ({ onHorizontalModeHeaderToggled }) => {
  const controlsShownTimeoutRef = useRef(null);

  const prolongControlsShowing = useCallback(() => {
    onHorizontalModeHeaderToggled(true);
    clearInterval(controlsShownTimeoutRef.current);
    controlsShownTimeoutRef.current = setTimeout(() => onHorizontalModeHeaderToggled(false), CONTROLS_SHOWN_TIMEOUT);
  }, [onHorizontalModeHeaderToggled]);

  useEffect(() => {
    prolongControlsShowing();
  }, [prolongControlsShowing]);

  return { prolongControlsShowing };
};

export default useHorizontalModeHeader;
