import {
  Node,
  Mark,
  mergeAttributes,
  nodeInputRule,
  markInputRule,
} from "@tiptap/core";

// const Todo = Node.create({
//   name: 'todo',
//   group: 'inline',
//   inline: true,
//   atom: false,

//   addAttributes() {
//     return {
//       state: {
//         default: 'TODO', // Initial state
//         parseHTML: (element) => element.getAttribute('data-state'),
//         renderHTML: (attributes) => {
//           return { 'data-state': attributes.state };
//         },
//       },
//       description: {
//         default: 'default descript',
//         parseHTML: (element) => element.getAttribute('data-description'),
//         renderHTML: (attributes) => {
//           return { 'data-description': attributes.description };
//         },
//       },
//     };
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'div[data-type="todo"]',
//       },
//     ];
//   },

//   renderHTML(attributes) {
//     const stateElement = document.createElement('span');
//     stateElement.textContent = attributes.node.attrs.state;
//     stateElement.className = `todo-state`

//     const descriptionElement = document.createElement('span');
//     descriptionElement.textContent = " " + attributes.node.attrs.description;
//     descriptionElement.className = "todo-description"

//     return [
//         'span',
//         mergeAttributes(attributes.HTMLAttributes, { 'data-type': 'todo', class: `${attributes.node.attrs.state.toLowerCase()}` }),
//         stateElement,
//         descriptionElement
//     ];
//   },

//   addInputRules() {
//     const regex = /((?:TODO|PROG|DONE)\b\s+.*?\.)$/;

//     return [
//       nodeInputRule({
//         find: regex,
//         type: this.type,
//         getAttributes: (match) => {
//           return {
//             state: match[1].slice(0, 4),
//             description: match[1].slice(5)
//           }
//         }
//       })
//     ];
//   },

//   addKeyboardShortcuts() {
//     return {
//       Backspace: ({ editor }) => this.deleteNodeAndRevertToText(editor),
//       Delete: ({ editor }) => this.deleteNodeAndRevertToText(editor),
//     };
//   },

//   deleteNodeAndRevertToText(editor) {
//     const { state, dispatch } = editor.view;
//     const { selection } = state;
//     const node = selection.node;

//     if (node && node.type.name === this.name) {
//       const text = `${node.attrs.state} ${node.attrs.description}`;
//       const tr = state.tr.replaceWith(selection.from, selection.to, editor.schema.text(text));
//       dispatch(tr);
//       return true; // Prevent default deletion
//     }

//     return false;
//   }
// });

const Todo = Mark.create({
  name: "todo",
  exitable: true,

  addAttributes() {
    return {
      state: {
        default: "TODO",
        parseHTML(element) {
          return element.getAttribute("state");
        },
      },
      description: {
        default: "",
        parseHTML(element) {
          console.log(element.getAttribute("description"))
          return element.getAttribute("description");
        },
      },
    };
  },

  renderHTML(attributes) {
    console.log(attributes.HTMLAttributes)
    const stateElement = document.createElement("span");
    stateElement.textContent = attributes.HTMLAttributes.state;
    stateElement.className = `todo-state`;

    const descriptionElement = document.createElement("span");
    descriptionElement.textContent =
      " " + attributes.HTMLAttributes.description;
    console.log(descriptionElement.textContent)
    descriptionElement.className = "todo-description";

    return [
      "span",
      mergeAttributes(attributes.HTMLAttributes, {
        "data-type": "todo",
        class: `${attributes.HTMLAttributes.state.toLowerCase()}`,
      }),
      stateElement,
      descriptionElement,
    ];
  },

  addInputRules() {
    const regex = /((?:TODO|PROG|DONE)\b\s+.*?\.)$/;

    return [
      markInputRule({
        find: regex,
        type: this.type,
        getAttributes: (match) => {
          console.log({match})
          return {
            state: match[1].slice(0, 4),
            description: match[1].slice(5)
          }
        }
      }),
    ];
  },
});

export default Todo;
