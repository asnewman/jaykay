import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { nav } from "./nav"

window.store = {
  showGoodbye: false,
  documents: [],
  currentDocument: null,
}

const routes = {
  "/": () => `
    ${nav()}
    -div(class="editor")
    `
}

const events = {
  "getDocuments": async (_, render) => {
    const response = await fetch('http://localhost:3000/documents');
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const documents = await response.json();
    console.log(documents)
    window.store.documents = documents;
    
    render("nav")
  },
  "switchDocument": async (data, render) => {
    console.log(data)
    window.store.currentDocument = JSON.parse(data);

    const provider = new HocuspocusProvider({
      url: "ws://localhost:3001",
      name: window.store.currentDocument,
    });

    new Editor({
      element: document.querySelector('.editor'),
      extensions: [
        StarterKit,
        Collaboration.extend().configure({
          document: provider.document,
        })
      ],
      content: '<p>Hello World!</p>',
    })
  }
}

new window.Ash(routes, events)