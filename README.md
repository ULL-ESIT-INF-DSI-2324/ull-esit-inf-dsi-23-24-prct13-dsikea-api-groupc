# Práctica 13 - DSIKEA API - GROUP C
## [🙂] Integrantes:
- Mariajose Zuloeta Brito
- Samuel Lorenzo Sánchez
- Adrián Lima García

<p align="center">
  <img src="https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc/badge.svg?branch=main" alt="Coverage Status">
  <img src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc/actions/workflows/node.js.yml/badge.svg" alt="Tests">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc&metric=alert_status" alt="Quality Gate Status">
</p>

---

## [💬] Introducción

Para ésta práctica hemos tenido que desarrollar nuestra propia API Rest haciendo uso de Express y MongoDB. La API que hemos desarrollado es una API para una tienda de muebles llamada DSIkea. En ella se pueden gestionar clientes, proveedores, muebles y transacciones mediante operaciones CRUD gracias a las rutas que hemos implementado.

Además, hemos hecho uso de herramientas como **MongoDB Atlas** para almacenar la base de datos en la nube y **Render** para desplegar la propia API también en la nube.

Lógicamente todo éste proceso ha sido llevado mediante pruebas unitarias, cubrimiento de código (Coveralls), análisis de calidad (SonarCloud) y despliegue continuo (GitHub Actions).

## [⚙️] Desarrollo

En éste apartado de desarrollo, se ha decidido dividir la explicación de las decisiones y el desarrollo en diferentes secciones. Primero, se explicarán de forma breve y concisa las diferentes herramientas utilizadas para ésta práctica y sus configuraciones pertinentes, además del por qué de la toma de dichas configuraciones. A continuación, se explicarán los modelos de la API y las rutas implementadas, así como las decisiones tomadas para su implementación.

### [🛠️] Herramientas utilizadas

#### [✉️] Express

Express es un framework de Node.js que permite crear aplicaciones web de forma sencilla. Nuestra API Rest ha sido desarrollada con Express.

Como se puede apreciar en la implementación de la API, hemos utilizado Express para la creación de la aplicación, la definición de las rutas y la gestión de las peticiones HTTP. Más adelante, en el apartado de rutas, se explicará más en detalle cómo se han implementado las mismas.

A grandes rasgos, las configuraciones que hemos tomado para Express han sido las siguientes:
- **Puerto de escucha**: Hemos definido el puerto de escucha de la aplicación en la variable de entorno `PORT`. En caso de no existir, se ha definido el puerto 3000 como puerto por defecto.
- Uso de `express.json()`: Hemos utilizado el middleware `express.json()` para poder parsear el cuerpo de las peticiones HTTP en formato JSON.
- Uso de las rutas: Hemos definido las rutas de la API en diferentes archivos para mantener una estructura más limpia y ordenada, y dentro del `index.js` hemos importado dichas rutas y las hemos montado en la aplicación.
- Uso de `express.Router()`: Hemos utilizado el método `express.Router()` para definir las rutas de la API de forma modular y reutilizable.

De nuevo, más adelante se explicará con más detalle cómo se han implementado las rutas.

#### [📖] MongoDB / Mongoose

MongoDB es una base de datos no relacional que hemos utilizado para almacenar los datos de la API. Para interactuar con la base de datos, hemos utilizado Mongoose, que nos permite definir modelos y esquemas para los datos y poder interactuar con la base de datos de una forma más sencilla y estructurada.

En cuanto a las configuraciones que hemos tomado para MongoDB y Mongoose, han sido las siguientes:
- **Conexión a la base de datos**: Hemos definido la URI de conexión a la base de datos en la variable de entorno `MONGODB_URI`. En caso de no existir, se ha definido una URI de conexión local.
- **Definición de modelos y esquemas**: Hemos definido los modelos y esquemas de la base de datos en diferentes archivos para mantener una estructura más limpia y ordenada, y dentro del `index.js` hemos importado dichos modelos y esquemas y los hemos utilizado para interactuar con la base de datos.

En un principio trabajamos de forma local con una base de datos MongoDB, pero finalmente realizamos la migración a MongoDB Atlas para poder desplegar la API en Render. Para la creación de la base de datos en local seguimos la [documentación para la instalación de MongoDB en Ubuntu](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-mongodb.html) con pasos ya realizados en prácticas anteriores.

#### [🌍] MongoDB Atlas

MongoDB Atlas es un servicio de base de datos en la nube que hemos utilizado para almacenar la base de datos de la API. Básicamente hemos utilizado MongoDB Atlas para poder tener la base de datos en la nube y poder acceder a ella desde cualquier lugar.

Si bien en una primera instancia, en las primeras fases del proyecto, utilizamos una base de datos MongoDB local, finalmente realizamos la migración a MongoDB Atlas para poder desplegar la API en Render.

Para la configuración de MongoDB Atlas, hemos seguido los siguientes pasos definidos en la [documentación sobre el despliegue con MongoDB Atlas y Render](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-deployment.html):


1. Creación de un clúster en MongoDB Atlas.

#### [📄] Render

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

---

### [🧬] Modelos

### Logica de rutas:
En la actualizacion de muebles de un proveedor, implica que puede cambiar la cantidad de un existente, y si en furniture no existe el mueble lo creamos en el inventario con un stock a 0 y con la cantidad que tiene el provedor

#### [👩] Cliente

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

#### [📦] Proveedor

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

#### [🪑] Mueble

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

### [🗃️] Rutas

#### [👩] Clientes

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

#### [📦] Proveedores

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

#### [🪑] Muebles

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

#### [💳] Transacciones

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

### [🧪] Pruebas

---


## [💭] Conclusiones

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

## [📚] Bibliografía

- [Enunciado de la práctica](https://ull-esit-inf-dsi-2324.github.io/prct13-DSIkea-api/)
- [Apuntes de la asignatura sobre NodeJS](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/)
- [Documentación para la instalación de MongoDB en Ubuntu](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-mongodb.html)
- [Documentación sobre el despliegue con MongoDB Atlas y Render](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-deployment.html)
