// This script runs in the context of the renderer process before any other scripts.
// It has access to both the DOM and Node.js APIs.

// Add an event listener for the 'DOMContentLoaded' event, which fires when the initial HTML document has been completely loaded and parsed.
window.addEventListener('DOMContentLoaded', () => {
  // Define a function to replace the text content of an element with a given selector.
  const replaceText = (selector, text) => {
    // Get the element by its selector.
    const element = document.getElementById(selector);
    // If the element exists, set its innerText to the provided text.
    if (element) element.innerText = text;
  };

  // Iterate over an array of dependencies ('chrome', 'node', 'electron').
  for (const dependency of ['chrome', 'node', 'electron']) {
    // Replace the text content of elements with IDs 'chrome-version', 'node-version', and 'electron-version'
    // with the corresponding version numbers from the process.versions object.
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});