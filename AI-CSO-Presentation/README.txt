HOW TO OPEN
  Double-click index.html (Chrome / Edge / Firefox / Safari). Keep the "videos" folder next to it.

CONTROLS
  Click anywhere, Right arrow, Space or Enter ... next
  Left arrow or Backspace ................... previous
  F ....................................... fullscreen     Home / End ... first / last slide

REBUILD FROM SOURCE (optional)
  cd source && mkdir -p public && cp -r ../videos public/videos
  npm install && npm run build        (output goes to source/dist)
  Slide text and layout .......... source/src/slides.jsx
  Text/3D/curve components ....... source/src/kit.jsx
  Interactive widgets ............ source/src/widgets.jsx
