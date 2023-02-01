import React, { useState, useRef, useEffect } from 'react';
import * as ReactDOM from 'react-dom';

function ZZKeepAlive(props) {
  const [target] = useState(() => document.createElement('div'));
  const containerRef = useRef();
  const activeRef = useRef(false);

  activeRef.current = activeRef.current || props.active;

  useEffect(() => {
    if (props.active) {
      containerRef.current.appendChild(target);
    } else if (containerRef.current.hasChildNodes()) {
      containerRef.current.removeChild(target);
    }
  }, [props.active]);

  return (
    <>
      <div ref={containerRef} />
      {activeRef.current && ReactDOM.createPortal(props.children, target)}
    </>
  );
}
export default ZZKeepAlive;
