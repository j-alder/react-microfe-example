import React, { useEffect } from 'react';

export function MicroFrontend(props) {

  useEffect(() => {

    function renderMicroFrontend() {
      window[`render${props.name}`](`${props.name}-container`, props.history);
    }

    const scriptId = `micro-frontend-script-${props.name}`;

    if (document.getElementById(scriptId)) {
      renderMicroFrontend();
      return;
    }

    fetch(`${props.host}/asset-manifest.json`)
      .then(res => res.json())
      .then(manifest => {
        const script = document.createElement('script');
        script.id = scriptId;
        script.crossOrigin = '';
        script.src = `${props.host}${manifest.files['main.js']}`;
        script.onload = renderMicroFrontend;
        document.head.appendChild(script);
      });

    return () => window[`unmount${props.name}`](`${props.name}-container`);
  });

  return <main id={`${props.name}-container`} />
}
