const fs = require('fs');
const i18nFolderSource = `${__dirname}/i18n/properties/`;
const i18nFolderDestination = `${__dirname}/src/generated/`;
const files = fs.readdirSync(i18nFolderSource);
const i18n = files
  .filter(file => file.endsWith('.properties'))
  .map(file => ({
    [file.split('.')[0]]: fs
      .readFileSync(i18nFolderSource + file, 'utf8')
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.indexOf('=') !== -1)
      .map(line => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1)];
      })
      .map(([k, v]) => ({ [k]: v }))
      .reduce((a, b) => ({ ...a, ...b }))
  }))
  .reduce((a, b) => ({ ...a, ...b }));
const json = JSON.stringify(i18n, null, 2);
fs.writeFileSync(i18nFolderDestination + 'i18n.json', json);
