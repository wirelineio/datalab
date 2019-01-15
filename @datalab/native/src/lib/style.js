import { ifProp } from 'styled-tools';
import StyleAttrs from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes.js';

const toKebab = str =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // get all lowercase letters that are near to uppercase ones
    .replace(/[\s_]+/g, '-') // replace all spaces and low dash
    .toLowerCase();

const rule = name => ifProp(name, props => `${toKebab(name)}: ${props[name]};`);

const rules = Object.keys(StyleAttrs);

rules.forEach(r => (module.exports[r] = rule(r)));
