import './widget.css'
import { useIframeSize } from './useIframeSize'

const widgetResizeMediaQuery = matchMedia('(max-width: 680px)')

// In this task I'm not sure if I understook the flicker correctly, as at first I've understood that intially on render the iframe should already have some initial sizes
// i.e. 117px on the wider screen and 154px on the narrow screen, but then I read that it's about visibly changing height/width so I changed the code to that approach
// to prevent layout shift with current text I've used min-height in CSS, but if the content is more dynamic in height I would be looking for another solution

export const Widget = () => {
  const { iframeContainerRef, iframeRef, iframeSize } = useIframeSize({
    initialSize: {
      height: 0,
      width: 0,
    },
    breakpointsMediaQuery: widgetResizeMediaQuery,
  })

  return (
    <div className="widget">
      <h1>App content</h1>
      <p>Check out our latest podcast</p>
      <div
        className="widget__container"
        ref={iframeContainerRef}
      >
        <iframe
          className="widget__iframe"
          height={iframeSize.height}
          width={iframeSize.width}
          src="/iframe"
          ref={iframeRef}
        />
      </div>
    </div>
  )
}
