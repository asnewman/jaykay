import { nav } from "./nav"
import { events } from "./events"
import { getDocuments } from "./helpers"

window.store = {
  showGoodbye: false,
  documents: [],
  currentDocument: null,
}

function docOptions() {
  return `
    -div(style="position: absolute; right: 10px; top: 10px;")
    --button(onclick="deleteDoc")
    ---"Delete"
  `
}

getDocuments().then(() => {
  const routes = {
    "/": () => {
      const markup = `
        -div(class="wrapper")
        {${nav()}}
        --div(id="titleEditorWrapper")
        ---div(id="topBar")
        ${window.store.currentDocument ? `{${docOptions()}}` : ""}
        ---div(id="docTitle")
        ${window.store.currentDocument ? `
          ----input(id="titleInput" type="text" placeholder="New document" value="${window.store.currentDocument.title}" oninput="updateTitle" onblur="getDocuments")
        ` : ""}
        ---div(class="editor")
        ---div(id="editorUnder" onclick="focusEditor")
        `

        return markup
      }
  }

  new window.Ash(routes, events)
})
