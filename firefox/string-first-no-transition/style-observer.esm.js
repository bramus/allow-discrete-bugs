/**
 * Passive observer for CSS properties. Instead of typical polling approach, it uses CSS
 * transitions to detect changes.
 *
 * CSSStyleObserver can be used to build dynamic theming system, detect media etc.
 *
 * Usage:
 * ```javascript
 * const cssStyleObserver = new CSSStyleObserver(['--my-variable'], (variables) => console.log("Value:",variables['--my-variable']));
 * cssStyleObserver.attach(document.body);
 * ```
 */
var CSSStyleObserver = /*#__PURE__*/function () {
  /**
   * Create a new (detached) instance of CSS variable observer.
   *
   * @param observedVariables list of CSS variables to observe
   * @param callback callback that will be invoked every time any of listed CSS variables change
   */
  function CSSStyleObserver(observedVariables, callback) {
    /*
     * Event handler that is used to invoke callback.
     */
    this._eventHandler = this._handleUpdate.bind(this);
    this._observedVariables = observedVariables;
    this._callback = callback;
    this._targetElement = null;
  }
  /**
   * Attach observer to target element. Callback will be invoked immediately with the current assigned values.
   *
   * @param targetElement target element
   */
  var _proto = CSSStyleObserver.prototype;
  _proto.attach = function attach(targetElement) {
    if (!this._targetElement) {
      this._targetElement = targetElement;
      this._setTargetElementStyles(this._targetElement);
      this._targetElement.addEventListener('transitionstart', this._eventHandler);
      this._handleUpdate();
    }
  }
  /**
   * Detach observer.
   */;
  _proto.detach = function detach() {
    if (this._targetElement) {
      this._unsetTargetElementStyles(this._targetElement);
      this._targetElement.removeEventListener('transitionstart', this._eventHandler);
      this._targetElement = null;
    }
  }
  /**
   * Attach the styles necessary to track the changes to the given element
   *
   * @param targetElement The element to track
   */;
  _proto._setTargetElementStyles = function _setTargetElementStyles(targetElement) {
    var cssTransitionValue = this._observedVariables.map(function (value) {
      return value + " 0.001ms step-start";
    }).join(', ');
    // @TODO: Don’t overwrite the existing transition
    targetElement.style.setProperty('transition', cssTransitionValue);
    targetElement.style.setProperty('transition-behavior', 'allow-discrete');
  }
  /**
   * Remove the styles that track the property changes
   *
   * @param targetElement The element to track
   */;
  _proto._unsetTargetElementStyles = function _unsetTargetElementStyles(targetElement) {
    // @TODO: Don’t remove all, only remove the tracked variables
    targetElement.style.removeProperty('transition');
    targetElement.style.removeProperty('transition-behavior');
  }
  /**
   * Collect CSS variable values and invoke callback.
   */;
  _proto._handleUpdate = function _handleUpdate() {
    console.log('_handleUpdate');
    if (this._targetElement) {
      var computedStyle = getComputedStyle(this._targetElement);
      var variables = {};
      this._observedVariables.forEach(function (value) {
        variables[value] = computedStyle.getPropertyValue(value);
      });
      // Do not invoke callback if no variables are defined
      if (Object.keys(variables).length > 0) {
        this._callback(variables);
      }
    }
  };
  return CSSStyleObserver;
}();

export default CSSStyleObserver;
export { CSSStyleObserver };
//# sourceMappingURL=style-observer.esm.js.map
