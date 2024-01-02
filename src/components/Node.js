/**
 * Nodes component returns HTML for a node with title, description,
 * input params, and output params
 *
 * @param {string} title - The title of the node
 * @param {string} description - The description of the node
 * @param {string} blockInput - HTML for the input params section
 * @param {string} blockOutput - HTML for the output params section
 * @returns {string} HTML string for the node component
 */

export const ComponentNode = (title, description, blockInput, blockOutput) => {
  return /*html*/ `
    <h1 class="node-title">
      ${title}
    </h1>
    <p class="node-description">
      ${description}
    </p>
    <div class="node-params">
      ${blockInput}
    </div>
    <div class="node-params">
      ${blockOutput}
    </div>
    `
}
