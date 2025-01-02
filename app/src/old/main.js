const { invoke } = window.__TAURI__.core;
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

let greetInputEl;
let greetMsgEl;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });

  new Editor({
    element: document.querySelector('#editor'),
    extensions: [StarterKit],
    content: "<p>Edit me</p>"
  })
});
