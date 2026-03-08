import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FragmentPortal } from '../src/FragmentPortal'

describe('FragmentPortal', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="menu"><li>Home</li></ul>'
  })

  afterEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('inserts children as direct siblings in target list', () => {
    const menu = document.querySelector('#menu') as HTMLUListElement

    render(
      React.createElement(
        FragmentPortal,
        { placePortalContainer: (fragment: DocumentFragment) => menu.append(fragment) },
        React.createElement('li', null, 'Extension item A'),
        React.createElement('li', null, 'Extension item B'),
      ),
    )

    const childSummary = Array.from(menu.children).map((child) => `${child.tagName}:${child.textContent}`)
    expect(childSummary).toEqual(['LI:Home', 'LI:Extension item A', 'LI:Extension item B'])
  })

  it('removes injected nodes from target list on unmount', () => {
    const menu = document.querySelector('#menu') as HTMLUListElement

    const { unmount } = render(
      React.createElement(
        FragmentPortal,
        { placePortalContainer: (fragment: DocumentFragment) => menu.append(fragment) },
        React.createElement('li', null, 'Extension item A'),
      ),
    )

    expect(menu.children).toHaveLength(2)
    unmount()

    expect(menu.children).toHaveLength(1)
    expect(menu.children.item(0)?.textContent).toBe('Home')
  })

  it('updates rendered nodes when children change', () => {
    const menu = document.querySelector('#menu') as HTMLUListElement
    const placePortalContainer = (fragment: DocumentFragment) => menu.append(fragment)

    const { rerender } = render(
      React.createElement(
        FragmentPortal,
        { placePortalContainer },
        React.createElement('li', null, 'Extension item A'),
      ),
    )

    expect(menu.textContent).toContain('Extension item A')

    rerender(
      React.createElement(
        FragmentPortal,
        { placePortalContainer },
        React.createElement('li', null, 'Extension item B'),
      ),
    )

    expect(menu.textContent).not.toContain('Extension item A')
    expect(menu.textContent).toContain('Extension item B')
  })

  it('forwards React click handlers on injected nodes', () => {
    const menu = document.querySelector('#menu') as HTMLUListElement
    const handleClick = vi.fn()

    render(
      React.createElement(
        FragmentPortal,
        { placePortalContainer: (fragment: DocumentFragment) => menu.append(fragment) },
        React.createElement('li', { onClick: handleClick }, 'Extension action'),
      ),
    )

    const actionItem = menu.querySelector('li:last-child')
    expect(actionItem).not.toBeNull()
    fireEvent.click(actionItem as HTMLElement)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
