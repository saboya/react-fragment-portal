# react-fragment-portal

Use `ReactDOM.createPortal` without introducing an extra container element.

This package is meant for browser-only DOM augmentation scenarios (for example, Chrome extension content scripts) where you need to inject valid children into an existing node tree, such as adding `<li>` items inside an existing `<ul>`.

## Why this exists

In some environments, adding a wrapper like `<div id="root">` breaks semantics or layout.

`FragmentPortal` renders children through a `DocumentFragment` and then places those nodes into your chosen DOM location, so your injected nodes appear as direct children of the host container.

## Intended usage

- Browser context only (no SSR support intended)
- DOM augmentation of pages you do not control
- Cases where an extra wrapper node is not acceptable

## API

```tsx
<FragmentPortal placePortalContainer={(fragment) => { ... }} portalKey="optional-key">
  {children}
</FragmentPortal>
```

- `placePortalContainer(fragment)`: callback where you attach the fragment into the DOM
- `portalKey` (optional): forwarded as the portal key

## Example: before/after DOM shape

Before:

```html
<ul id="menu">
  <li>Home</li>
  <li>Docs</li>
</ul>
```

Render (pseudo-JSX):

```tsx
<FragmentPortal placePortalContainer={(fragment) => menu.append(fragment)}>
  <li>Extension item A</li>
  <li>Extension item B</li>
</FragmentPortal>
```

After:

```html
<ul id="menu">
  <li>Home</li>
  <li>Docs</li>
  {/* FragmentPortal children are inserted here as direct <li> siblings */}
  <li>Extension item A</li>
  <li>Extension item B</li>
</ul>
```
