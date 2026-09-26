/**
 * ============================================================================
 * MAIN ENTRYPOINT (REACT 18 ROOT)
 * ============================================================================
 */

(function () {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  if (window.ReactDOM && window.ReactDOM.createRoot) {
    const root = window.ReactDOM.createRoot(rootElement);
    root.render(React.createElement(window.App));
  } else if (window.ReactDOM && window.ReactDOM.render) {
    window.ReactDOM.render(React.createElement(window.App), rootElement);
  }
})();
