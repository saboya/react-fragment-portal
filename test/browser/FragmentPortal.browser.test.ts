import React from 'react'
import { cleanup, render } from 'vitest-browser-react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FragmentPortal } from '../../src/FragmentPortal'

describe('FragmentPortal (browser)', () => {
  let menu: HTMLUListElement

  beforeEach(() => {
    document.body.innerHTML = '<ul id="menu"><li>Home</li></ul>'
    menu = document.querySelector('#menu') as HTMLUListElement
  })

  afterEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('injects list items without an extra wrapper', () => {
    render(
      React.createElement(
        FragmentPortal,
        { placePortalContainer: (fragment: DocumentFragment) => menu.append(fragment) },
        React.createElement('li', null, 'Extension item A'),
        React.createElement('li', null, 'Extension item B'),
      ),
    )

    const texts = Array.from(menu.children).map((child) => child.textContent)
    expect(texts).toEqual(['Home', 'Extension item A', 'Extension item B'])
  })

  it('keeps click handlers wired in real browser mode', async () => {
    const onClick = vi.fn()

    const screen = render(
      React.createElement(
        FragmentPortal,
        { placePortalContainer: (fragment: DocumentFragment) => menu.append(fragment) },
        React.createElement('li', { onClick }, 'Action'),
      ),
    )

    await screen.getByText('Action').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
