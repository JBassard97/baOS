# B.A.O.S (Browser Assisted Operating System)

Live: https://baos-client.netlify.app/

## Table of Contents

- [App Types](#app-types)
  - [Default Apps](#default-apps)
  - [IFrame Apps](#iframe-apps)
  - [~~Custom Apps~~ (WIP)](#custom-apps-wip)
- [Applications](#applications)
  - [File Manager](#file-manager)
  - [Terminal](#terminal)
  - [Text Editor](#text-editor)
  - [Image Viewer](#image-viewer)
  - [Video Player](#video-player)
  - [Markdown Viewer](#markdown-viewer)
  - [HTML Viewer](#html-viewer)
  - [Google](#google)
  - [Wikipedia](#wikipedia)
  - [Meow Masher](#meow-masher)
  - [Strudel](#strudel)
- [Stack](#stack)
  - [Libraries](#libraries)
    - [Client](#client)
    - [Server](#server)
  - [Languages](#languages)

## App Types

BAOS applications currently come in 3 varieties:

### Default Apps

- Live directly in BAOS source code as components
- Frequently interop with OPFS and Zustand stores in a safe manner
- Click events inside will focus the window
- These are the apps you'd typically expect to come with an OS
- Examples: <b>File Manager, Text Editor, Image Viewer</b>

### IFrame Apps

- An HTML iframe element with a pre-scpecified url as the `src` prop
- Example:

```html
<iframe src="https://wikipedia.com" />
```

- While many of your favorite sites refuse to be rendered inside another site's iframe, BAOS has precurated a number of reliable URLs that won't throw CORS inside of iframes
- Click events will <i>NOT</i> bubble up to parent from the iframe, so window-focusing must be done by touching the window's title bar
- Examples: <b>Google, Wikipedia</b>

### ~~Custom Apps~~ (WIP)

- Users can create an HTML file and register it using the "`reg-app`" command in the Terminal
- This HTML file can have linked CSS stylesheets, JS scripts, and icon files as you normally would, and BAOS service-worker resolves each request with the correct file from OPFS
- Linked scripts can be `type="module"` and `import` statements will work
- At it's core the Custom App's HTML file is rendered within an `iframe`, so click events will not focus the window

## Applications

### File Manager

- Type: [Default App](#default-apps)

### Terminal

- Type: [Default App](#default-apps)

### Text Editor

- Type: [Default App](#default-apps)

### Image Viewer

- Type: [Default App](#default-apps)

### Video Player

- Type: [Default App](#default-apps)

### Markdown Viewer

- Type: [Default App](#default-apps)

### HTML Viewer

- Type: [Default App](#default-apps)/[IFrame App](#iframe-apps) Hybrid

### Google

- Type: [IFrame App](#iframe-apps)
- URL: https://www.google.com/webhp?igu=1

### Wikipedia

- Type: [IFrame App](#iframe-apps)
- URL: https://wikipedia.com

### Meow Masher

- Type: [IFrame App](#iframe-apps)
- URL: https://jbassard97.github.io/MeowMasher/

### Strudel

- Type: [IFrame App](#iframe-apps)
- URL: https://strudel.cc

## Stack

### Libraries

#### Client

- React
- Vite
- Sass
- Zustand
- CodeMirror (used in [Text Editor](#text-editor))
- React Markdown (used in [Markdown Viewer](#markdown-viewer))
- React Syntax Highlighter (used in [Markdown Viewer](#markdown-viewer))

#### Server

- Express

### Languages

- HTML
- SCSS/CSS
- TS/JS
- TSX
