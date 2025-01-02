function nav() {
  if (!window.store) return ``

  const navItems = window.store.documents.map(document => navItem(document)).join("");

  return `
    -div(id="nav")
    --button(onclick="getDocuments")
    ---"Get Documents"
    --div(id="documents")
    {${navItems}}
  `
}

function navItem(document) {
  return `
    -button(onclick='switchDocument("${document.title}")')
    --"${document.title}"
  `
}

export {
  nav
}