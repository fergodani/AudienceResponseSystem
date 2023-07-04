# Webapp

Este proyecto corresponde con la aplicación web del sistema hecha en Angular.

## Development server

Ejecuta `ng serve --ssl --ssl-cert '../restapi/certificate/certificate.crt' --ssl-key '../restapi/certificate/privateKey.key'` para desplegar localmente la app. Navega a `https://localhost:4200/`.

## Build

Ejecuta `ng build` para compilar el proyecto. Los artefactos compilados se encuentran en el direcotrio `dist/`.

## Running unit tests

Ejecuta `ng test` para correr los tests unitarios vía [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Ejecuta `cd ./src/e2e && npx testcafe 'chrome --allow-insecure-localhost' --hostname localhost admin.js login.js professor.js student.js` para correr los tests ent-to-end vía [TestCafe](https://testcafe.io/). Deberás tener arrancada tanto la aplicación como la API Rest para ejecutarlos.