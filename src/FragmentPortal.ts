import React from 'react'
import ReactDOM from 'react-dom'

export interface Props {
  placePortalContainer: (fragment: DocumentFragment) => void
  portalKey?: string
}

type NonNullableEventListenerParams = [
  Parameters<EventTarget['addEventListener']>[0],
  NonNullable<Parameters<EventTarget['addEventListener']>[1]>,
  Parameters<EventTarget['addEventListener']>[2],
]

export const FragmentPortal: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const documentFragment = React.useMemo<DocumentFragment>(() => document.createDocumentFragment(), [])
  const eventListenersRef = React.useRef<NonNullableEventListenerParams[]>([])

  const proxiedDocumentFragment = React.useMemo(() => {
    const handler: ProxyHandler<DocumentFragment> = {
      get(target, prop: keyof ShadowRoot, _) {
        switch (prop) {
          case 'addEventListener': {
            return function(
              type: keyof HTMLElementEventMap,
              listener: EventListenerOrEventListenerObject,
              options: AddEventListenerOptions,
            ) {
              eventListenersRef.current.push([type, listener, options])
            }
              .bind(target)
          }
          case 'removeChild': {
            return function(child: Node) {
              // We'll deal with cleaning up the nodes later, so just return the child
              return child
            }
              .bind(target)
          }
        }

        const value = Reflect.get(target, prop)

        if (value instanceof Function) {
          return value.bind(target)
        }

        return value
      },
    }

    return new Proxy(documentFragment, handler)
  }, [documentFragment])

  React.useLayoutEffect(() => {
    // Acuire reference to the child nodes of the document fragment before attaching it to the DOM
    const childNodes = Array.from(documentFragment.childNodes)

    // Attach the document fragment to the DOM
    props.placePortalContainer(documentFragment)

    // Try to get a reference to the parent element
    const parentElement = childNodes.at(0)?.parentElement ?? undefined

    if (parentElement !== undefined) {
      for (const descriptor of eventListenersRef.current) {
        parentElement.addEventListener.call(parentElement, descriptor[0], descriptor[1], descriptor[2])
      }
    }

    return () => {
      if (parentElement === undefined) {
        return
      }

      for (const descriptor of eventListenersRef.current) {
        parentElement.removeEventListener.call(parentElement, descriptor[0], descriptor[1])
      }

      for (const childNode of childNodes) {
        childNode.remove()
        documentFragment.append(childNode)
      }
    }
  }, [props.placePortalContainer, props.children])

  return ReactDOM.createPortal(props.children, proxiedDocumentFragment, props.portalKey)
}
