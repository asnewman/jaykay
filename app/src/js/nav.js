function nav() {
  if (!window.store) return ``

  const navItems = window.store.documents.map(document => navItem(document)).join("");

  return `
    -div(id="nav" class="nav")
    --button(class="navItem" onclick='switchDocument(null)')
    ---"New document"
    --div(id="documents")
    --{${navItems}}
  `
}

function navItem(document) {
  delete document["content"]
  const documentString = JSON.stringify(document)
  // hyphen placement is temporary because of https://github.com/asnewman/ashjs/issues/9
  return `
    -button(class="navItem" onclick='switchDocument(${documentString})')
    --"${document.title}"
  `
}

export {
  nav
}