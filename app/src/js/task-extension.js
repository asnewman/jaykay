import { mergeAttributes, Node } from "@tiptap/core";

const Task = Node.create({
  name: "task",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      status: {
        default: "TODO"
      },
      description: {
        default: ""
      }
    }
  },

  parseHTML() {
    return [
      {tag: "task"}
    ]
  },

  renderHTML({HTMLAttributes}) {
    return ["task", mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ({editor, node, getPos}) => {
      const { view } = editor;

      const dom = document.createElement("div")
      dom.classList.add(node.attrs.status.toLowerCase())
      dom.classList.add("task")

      const status = document.createElement('button')
      status.innerHTML = node.attrs.status
      status.contentEditable = false
      status.addEventListener("click", () => {
        if (typeof getPos === 'function') {
          let next = node.attrs.status === "TODO" ? "PROG" : "DONE"
          next = node.attrs.status === "DONE" ? "TODO" : next

          view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, {
            status: next,
          }))

          editor.commands.focus()
        }
      })

      const description = document.createElement("span")
      description.classList.add("task-description")

      dom.append(status, description)

      return {
        dom,
        contentDOM: description
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      "Mod-l": () => this.editor.commands.insertContent("<task>This is default description text</task>")
    }
  }
})

export default Task;