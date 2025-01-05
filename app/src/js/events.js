import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'

const BASE_URL = 'http://localhost:3000';

const events = {
  "getDocuments": async (_, render) => {
    const response = await fetch(`${BASE_URL}/documents`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const documents = await response.json();
    window.store.documents = documents;
    
    render("nav")
  },
  "switchDocument": async (rawData, render) => {
    let data = JSON.parse(rawData)

    if (!data) {
      const response = await fetch(`${BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: '' }),
      });

      if (!response.ok) {
      throw new Error('Failed to create new document');
    }

      const newDocument = await response.json();
      console.log(newDocument)

      data = newDocument
    }

    window.store.currentDocument = data;

    const provider = new HocuspocusProvider({
      url: "ws://localhost:3001",
      name: `${window.store.currentDocument.id}`, // lmao this needs to be a string or else it wont work...
    });

    new Editor({
      element: document.querySelector('.editor'),
      extensions: [
        StarterKit,
        Collaboration.extend().configure({
          document: provider.document,
        })
      ]
    })

    render('docTitle')
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
  }
}

export {
  events
}