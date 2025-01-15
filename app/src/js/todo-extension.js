import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';

const Todo = Node.create({
  name: 'todo',
  group: 'inline',
  inline: true,

  addAttributes() {
    return {
      state: {
        default: 'TODO', // Initial state
        parseHTML: (element) => element.getAttribute('data-state'),
        renderHTML: (attributes) => {
          return { 'data-state': attributes.state };
        },
      },
      description: {
        default: 'default descript',
        parseHTML: (element) => element.getAttribute('data-description'),
        renderHTML: (attributes) => {
          return { 'data-description': attributes.description };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="todo"]',
      },
    ];
  },

  renderHTML(attributes) {
    const stateElement = document.createElement('span');
    stateElement.textContent = attributes.node.attrs.state;
    stateElement.className = `todo-state`

    const descriptionElement = document.createElement('span');
    descriptionElement.textContent = " " + attributes.node.attrs.description;
    descriptionElement.className = "todo-description"

    return [
        'span', 
        mergeAttributes(attributes.HTMLAttributes, { 'data-type': 'todo', class: `${attributes.node.attrs.state.toLowerCase()}` }), 
        stateElement,
        descriptionElement
    ];
  },

  // addNodeView() {
  //   return ({ node, getPos, editor }) => {
  //     const dom = document.createElement('div');
  //     dom.className = 'todo-item';
  //     dom.setAttribute('data-type', 'todo-item');
  //     dom.setAttribute('contenteditable', 'false');

  //     const stateSpan = document.createElement('span');
  //     stateSpan.textContent = node.attrs.state;

  //     const descriptionSpan = document.createElement('span');
  //     descriptionSpan.textContent = `: ${node.attrs.description}`;
  //     descriptionSpan.contentEditable = 'true';

  //     dom.append(stateSpan, descriptionSpan);

  //     // Toggle state on click
  //     dom.addEventListener('click', () => {
  //       const newState = node.attrs.state === 'TODO'
  //         ? 'IP'
  //         : node.attrs.state === 'IP'
  //         ? 'DONE'
  //         : 'TODO';

  //       editor.commands.updateAttributes('todoItem', { state: newState });
  //     });

  //     // Update description dynamically
  //     descriptionSpan.addEventListener('input', () => {
  //       editor.commands.updateAttributes('todoItem', {
  //         description: descriptionSpan.textContent,
  //       });
  //     });

  //     return {
  //       dom,
  //       contentDOM: descriptionSpan,
  //     };
  //   };
  // },

  addInputRules() {
    const regex = /((?:TODO|PROG|DONE)\b\s+.*?\.)$/;

    return [
      nodeInputRule({
        find: regex,
        type: this.type,
        getAttributes: (match) => {
          return {
            state: match[1].slice(0, 4),
            description: match[1].slice(5)
          }
        }
      })
    ];
  },
});

export default Todo;