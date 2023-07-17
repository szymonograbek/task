import React, { useState, useRef, useEffect } from 'react'

import './widget.css'

export const Widget = () => {
  const [width, setWidth] = useState()
  const iframeContainer = useRef<any>()

  useEffect(() => {
    const measurements = iframeContainer.current.getBoundingClientRect()
    if (measurements) {
      setWidth(measurements.width)
    }
  }, [])

  return (
    <div className="widget">
      <h1>App content</h1>
      <p>Check out our latest podcast</p>
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
        ref={iframeContainer}
      >
        <iframe
          height="117px"
          width={width}
          src="/iframe"
          style={{ border: 0 }}
        />
      </div>
    </div>
  )
}
