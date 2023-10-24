import { useEffect, useLayoutEffect } from 'react'
import { HeightMessage, ResizeMessage } from './types'

const sendHeightMessage = () => {
  // use document.documentElement to get the height to take the margins into consideration
  const documentHeight = document.documentElement.getBoundingClientRect().height

  const message: HeightMessage = {
    action: 'height-change',
    payload: documentHeight,
  }

  window.parent.postMessage(message, '*')
}

const sendHeightMessageOnResize = (e: MessageEvent<ResizeMessage>) => {
  if (e.data.action === 'resize') {
    sendHeightMessage()
  }
}

export function useSyncHeightWithParent() {
  useLayoutEffect(() => {
    sendHeightMessage()
  }, [])

  useEffect(() => {
    window.addEventListener('message', sendHeightMessageOnResize)

    return () => window.removeEventListener('message', sendHeightMessageOnResize)
  }, [])
}
