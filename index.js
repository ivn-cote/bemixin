import classNames from 'classnames';
import  _ from 'lodash';

const mixin = {
  _getComponentNameFromDisplayName() {
    var displayName = this.bemComponentName || this.constructor.displayName;
    return _.camelCase(displayName);
  },
  getComponentName() {
    return this._componentName || (
      this._componentName = this._getComponentNameFromDisplayName()
    );
  },
  setComponentName(name) {
    this._componentName = name;
  },
  asHelper(displayName) {
    return new function() {
      _.extend(this,
        { props: { className: _.camelCase(displayName) } },
        _.mapValues(mixin, method => method.bind(this))
      );

      return _.ary(this.b_, 1);
    };
  },
  b_(bemStrings, optIsWrapper) {
    if (this.props.className && (!optIsWrapper || optIsWrapper == 'overflow')) {
      this.setComponentName(this.props.className);
    }

    if (!_.isArray(bemStrings))
      bemStrings = [ bemStrings || '' ];
    var modificatorSeparator = '_',
      elementSeparator = '-',
      bemNotation = {};

    if (this.props.className) {
      if (optIsWrapper == 'inherit')
        bemStrings = bemStrings.concat(this.props.className.split(' '));
      else
        bemNotation[this.props.className] = true;
    }

    bemStrings.forEach((bemString) => {
      if (typeof bemString !== 'string') {
        bemNotation['wrongBemString'] = true;
        return;
      }
      var modSeparation = bemString.split(modificatorSeparator),
        elementSeparation = modSeparation[0].split(elementSeparator),
        modificator = _.get(modSeparation, '[1]', null),
        element = _.get(elementSeparation, '[1]', null),
        block = elementSeparation[0] || this.getComponentName();

      modificator && Object.keys(this.state || {}).length
        && modificator in this.state && !this.state[modificator]
        && (modificator = null);

      bemNotation[block] = !element;
      bemNotation[block + modificatorSeparator + modificator] = !element && !!modificator;
      bemNotation[block + elementSeparator + element] = !!element;
      bemNotation[block + elementSeparator + element + modificatorSeparator + modificator] = !!element && !!modificator;
    });
    return classNames(bemNotation);
  }
};

module.exports = mixin;
