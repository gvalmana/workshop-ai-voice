## i18n

This directory is to serve your locale translation files. YAML under this folder would be loaded automatically and register with their filenames as locale code.

Check out [`vue-i18n`](https://github.com/intlify/vue-i18n-next) for more details.

If you are using VS Code, [`i18n Ally`](https://github.com/lokalise/i18n-ally) is recommended to make the i18n experience better.

## traducciones por version

para agregar traducciones por version crear un archivo con el formato `{{idioma}}_{{version de la app}}.yml`

idiomas disponibles | codigo
---                 | ---
español             | es
ingles              | en

regiones disponibles | codigo
---                  | ---
argentina            | AR
chile                | CL
colombia             | CO
costa rica           | CR
republica dominicana | DO
españa               | ES
kenia                | KE
mexico               | MX
nigeria              | NG
panama               | PA
peru                 | PE
usa                  | US
Sudáfrica            | ZA

Ej. archivo de traducciones para argentina en ingles: `en_AR.yml`

