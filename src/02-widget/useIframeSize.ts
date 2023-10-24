import React, { useEffect, useLayoutEffect } from 'react'
import { HeightMessage, ResizeMessage } from './types'

interface SizeState {
  height: number
  width: number
}

interface UseIframeSizeArgs {
  initialSize: SizeState
  // I've used Media Query as in this task the width changes when a certain screen size is reached, otherwise I would have used 'resize' event or ResizeObserver
  // to not to fire the callback too many times I've sticked with this solution
  breakpointsMediaQuery: MediaQueryList
}

export function useIframeSize({ initialSize, breakpointsMediaQuery }: UseIframeSizeArgs) {
  const [iframeSize, setIframeSize] = React.useState<SizeState>(initialSize)
  const iframeContainerRef = React.useRef<HTMLDivElement>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const updateIframeWidthToMatchContainer = React.useCallback(() => {
    const measurements = iframeContainerRef.current?.getBoundingClientRect()

    if (measurements?.width) {
      setIframeSize(prev => ({
        ...prev,
        width: measurements.width,
      }))
    }
  }, [])

  const updateIframeHeightFromMessage = React.useCallback((e: MessageEvent<HeightMessage>) => {
    if (e.data.action === 'height-change') {
      setIframeSize(prev => ({
        ...prev,
        height: e.data.payload,
      }))
    }
  }, [])

  const sendResizeMessageToIframe = React.useCallback(() => {
    const message: ResizeMessage = {
      action: 'resize',
    }

    iframeRef.current?.contentWindow?.postMessage(message)
  }, [])

  useLayoutEffect(() => {
    updateIframeWidthToMatchContainer()
  }, [updateIframeWidthToMatchContainer])

  useEffect(() => {
    const onContainerWidthChange = () => {
      updateIframeWidthToMatchContainer()
      sendResizeMessageToIframe()
    }

    window.addEventListener('message', updateIframeHeightFromMessage)
    breakpointsMediaQuery.addEventListener('change', onContainerWidthChange)

    return () => {
      window.removeEventListener('message', updateIframeHeightFromMessage)
      breakpointsMediaQuery.removeEventListener('change', onContainerWidthChange)
    }
  }, [updateIframeHeightFromMessage, sendResizeMessageToIframe, updateIframeWidthToMatchContainer])

  return {
    iframeSize,
    iframeContainerRef,
    iframeRef,
  }
}
