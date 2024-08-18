import { Exports } from '../endpoints/endpoints';

let exportStart = "import BevorAPI from './build/pkgbuild'\n";

exportStart += Exports.reduce((str, item) => {
  str += `export const ${item} = BevorAPI['${item}'];\n`;
  return str;
}, '');

console.log(`pkg="${exportStart + 'export default BevorAPI'}"`);
