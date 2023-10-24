import { useSyncHeightWithParent } from './useSyncHeightWithParent'

export const IframeApp = () => {
  useSyncHeightWithParent()

  return <div className="iframe-app">Dynamic marketing content will be here</div>
}
