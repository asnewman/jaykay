function nav() {
  if (!window.store) return ``

  const navItems = window.store.documents.map(document => navItem(document)).join("");
  console.log(navItems)

  return `
    -div(id="nav")
    {${navItems}}
    --button(onclick="getDocuments")
    ---"Get Documents"
    -button(onclick='switchDocument(null)')
    --"New document"
    --div(id="documents")
  `
}

function navItem(document) {
  const documentString = JSON.stringify(document)
  return `
    -button(onclick='switchDocument(${documentString})')
    --"${document.title}"
  `
}

export {
  nav
}