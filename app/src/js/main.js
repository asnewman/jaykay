import { nav } from "./nav"
import { events } from "./events"
import { getDocuments } from "./helpers"

window.store = {
  showGoodbye: false,
  documents: [],
  currentDocument: null,
}

getDocuments().then(() => {
  const routes = {
    "/": () => {
      return `
        -div(class="wrapper")
        {${nav()}}
        --div(id="titleEditorWrapper")
        ---div(id="docTitle")
        ${window.store.currentDocument ? `
          ----input(id="titleInput" type="text" placeholder="New document" value="${window.store.currentDocument.title}" oninput="updateTitle" onblur="getDocuments")
        ` : ""}
        ---div(class="editor")
        ---div(id="editorUnder" onclick="focusEditor")
        `
      }
  }

  new window.Ash(routes, events)
})