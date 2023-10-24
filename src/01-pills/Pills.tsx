import React, { useEffect, useLayoutEffect } from 'react'
import { PillData } from './data'
import { Pill } from './Pill'

interface PillsProps {
  pills: PillData[]
  headers: string[] // ids of pills that are toggled on
  toggleHeader: (id: string) => void
}

interface LayoutBreakElement {
  index: string
  type: 'line-break'
}

interface LayoutPillElement {
  index: string
  type: 'pill'
  pill: PillData
}

interface PillRef {
  node: HTMLDivElement
  pillMaxWidth: number
}

type LayoutElement = LayoutBreakElement | LayoutPillElement

// As ideally in this task I would only modify this file I left the header width as a static number here,
// otherwise I would probably ensure a static height/width of the header inside the Pill.tsx file and use this variable here and in Pill.tsx
// so if someone changed the size of the header in the future they would do it through this variable
const HEADER_WIDTH = 22

export function Pills({ pills, headers, toggleHeader }: PillsProps) {
  const containerNode = React.useRef<HTMLDivElement>(null)
  const pillRefs = React.useRef<{ [id: PillData['id']]: PillRef }>({})

  const [layoutElements, setLayoutElements] = React.useState<LayoutElement[]>(() => {
    return pills.map(pill => ({
      index: pill.id,
      type: 'pill',
      pill: pill,
    }))
  })

  const getPillMaxWidth = (currentWidth: number, id: string) => {
    const isToggled = headers.includes(id)

    return currentWidth + (isToggled ? 0 : HEADER_WIDTH)
  }

  const addLineBreaksToLayout = React.useCallback(() => {
    if (!containerNode.current) return

    const containerWidth = containerNode.current.offsetWidth
    const nextLayoutElements: LayoutElement[] = []

    let widthSum = 0

    pills.forEach(pill => {
      const { id } = pill

      if (!pillRefs.current[id]) return

      const { pillMaxWidth } = pillRefs.current[id]

      const doesPillFitInRow = pillMaxWidth + widthSum <= containerWidth

      const layoutPill: LayoutPillElement = {
        index: pill.id,
        type: 'pill',
        pill: pill,
      }

      if (doesPillFitInRow) {
        widthSum += pillMaxWidth

        nextLayoutElements.push(layoutPill)
      } else {
        widthSum = pillMaxWidth

        const lineBreak: LayoutBreakElement = { type: 'line-break', index: pill.id }

        nextLayoutElements.push(lineBreak, layoutPill)
      }
    }, [])

    setLayoutElements(nextLayoutElements)
  }, [pills])

  useLayoutEffect(() => {
    addLineBreaksToLayout()
  }, [addLineBreaksToLayout])

  useEffect(() => {
    let debounceTimeout: NodeJS.Timer | null = null

    const debouncedAddLineBreaksToLayout = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }

      debounceTimeout = setTimeout(addLineBreaksToLayout, 100)
    }

    const resizeObserver = new ResizeObserver(debouncedAddLineBreaksToLayout)

    if (containerNode.current) resizeObserver.observe(containerNode.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [addLineBreaksToLayout])

  const setPillRef = (id: PillData['id'], node: HTMLDivElement) => {
    if (node) {
      pillRefs.current[id] = { node, pillMaxWidth: getPillMaxWidth(node.offsetWidth, id) }
    }
  }

  return (
    <div ref={containerNode}>
      {layoutElements.map(el => {
        if (el.type === 'line-break') {
          return <br key={`__${el.type}-${el.index}`} />
        } else {
          return (
            <Pill
              key={el.pill.id}
              header={headers.includes(el.pill.id)}
              onClick={() => {
                toggleHeader(el.pill.id)
              }}
              ref={element => element && setPillRef(el.pill.id, element)}
            >
              {el.pill.value}
            </Pill>
          )
        }
      })}
    </div>
  )
}
