/**
 * This function is called once when the bundle in which
 * the component is is evaluated in the browser.
 * For one component it could be called several times
 * if it's contained in several bundles (lazy loaded code,
 * micro-frontend sub app etc).
 * In this version of style-inject only a single style
 * tag will be added inside the head tag.
 */
function styleInject(css, ref) {
  if (!css || typeof document === 'undefined') {
    return;
  }

  const firstIndexOfSpace = css.indexOf('{');
  const id = css.substring(0, firstIndexOfSpace);

  if (window.__stylesInjectIds && window.__stylesInjectIds[id]) {
    return;
  }

  if (!window.__stylesInjectIds) {
    window.__stylesInjectIds = {};
  }

  window.__stylesInjectIds[id] = true;

  if (ref === void 0) {
    ref = {};
  }

  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');

  style.id = id;

  if (head.firstChild) {
    head.insertBefore(style, head.firstChild);
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

export default styleInject;
