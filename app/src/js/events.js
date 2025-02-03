import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Placeholder from "@tiptap/extension-placeholder"
import * as Y from 'yjs'
import { getDocuments } from "./helpers.js"
import Task from "./task-extension"

const BASE_URL = 'http://localhost:3000';

const events = {
  "getDocuments": async (_, render) => {
    await getDocuments();
    
    render("nav")
  },
  "switchDocument": async (rawData, render, emit) => {
    if (window.store.editor) {
      window.store.editor.destroy()
    }

    let data = JSON.parse(rawData)

    if (!data) {
      const response = await fetch(`${BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Untitled document' }),
      });

      if (!response.ok) {
      throw new Error('Failed to create new document');
    }

      const newDocument = await response.json();

      data = newDocument
    }

    window.store.currentDocument = data;

    const provider = new HocuspocusProvider({
      url: "ws://localhost:3001",
      name: `${window.store.currentDocument.id}`, // lmao this needs to be a string or else it wont work...
    });

    const editor = new Editor({
      element: document.querySelector('.editor'),
      extensions: [
        StarterKit,
        Collaboration.extend().configure({
          document: provider.document,
        }),
        Placeholder.configure({
          placeholder: "Write something..."
        }),
        Task
      ]
    })
   
    window.store.editor = editor

    render('docTitle')
    render('topBar')
    emit("getDocuments")
  },
  "updateTitle": async (data, render) => {
    const newTitle = document.getElementById('titleInput').value

    const response = await fetch(`${BASE_URL}/documents/${window.store.currentDocument.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    });

    await response.json();
  },
  "deleteDoc": async (data, render, emit) => {
    const confirmed = confirm("Are you sure you want to delete this document?")

    if (!confirmed) {
      return
    }

    const response = await fetch(`${BASE_URL}/documents/${window.store.currentDocument.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (window.store.editor) {
      window.store.editor.destroy()
    }

    window.store.currentDocument = null

    emit("getDocuments")
    render('docTitle')
    render('topBar')
  },
}

export {
  events
}
