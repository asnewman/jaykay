import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";

const Task = Node.create({
  name: "task",
  group: "inline",
  content: "text*",
  inline: true,

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
    return ["task", mergeAttributes(HTMLAttributes), HTMLAttributes.description]
  },

  addNodeView() {
    return ({editor, node, getPos}) => {
      const { view } = editor;

      const dom = document.createElement("span")
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
      "Mod-l": () => this.editor.commands.insertContent("<task></task>"),
      ArrowRight: ({ editor }) => {
        const { state } = editor
        const { selection, doc } = state
        const { $from, empty } = selection

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

        if (!isAtEnd) {
          return false
        }

        const after = $from.after()

        if (after === undefined) {
          return false
        }

        const nodeAfter = doc.nodeAt(after)
        if (nodeAfter) {
          return editor.commands.command(({ tr }) => {
            tr.setSelection(Selection.near(doc.resolve(after)))
            return true
          })
        }

        return editor.commands.insertContentAt(after, " ")
      },
    }
  },

  addInputRules() {
    const regex = /(TODO|PROG|DONE)/;
    return [
      nodeInputRule({
        find: regex,
        type: this.type,
        getAttributes: (match) => ({
          status: match[0],
          description: "hello world"
        })
      })
    ]
  }
})

export default Task;
