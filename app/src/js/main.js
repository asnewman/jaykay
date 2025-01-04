import { nav } from "./nav"
import { events } from "./events"

window.store = {
  showGoodbye: false,
  documents: [],
  currentDocument: null,
}

const routes = {
  "/": () => {
    console.log(window.store)
    return `
      ${nav()}
      -div(id="docTitle")
      ${window.store.currentDocument ? `
        --input(id="titleInput" type="text" value="${window.store.currentDocument.title}" oninput="updateTitle")
      ` : ""}
      -h1()
      --"${window.store.currentDocument?.title || ""}"
      -div(class="editor")
      `
    }
}

new window.Ash(routes, events)