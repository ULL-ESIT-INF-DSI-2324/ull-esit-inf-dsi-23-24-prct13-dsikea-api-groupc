# Práctica 13 - DSIKEA API - GROUP C
## [🙂] Integrantes:
- Mariajose Zuloeta Brito
- Samuel Lorenzo Sánchez
- Adrián Lima García

<p align="center">
  <a href="https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc?branch=main">
    <img src="https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc/badge.svg?branch=main" alt="Coverage Status">
  </a>
  <a href="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc/actions/workflows/node.js.yml">
    <img src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc/actions/workflows/node.js.yml/badge.svg" alt="Tests">
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc&metric=alert_status" alt="Quality Gate Status">
  </a>
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


1. Acceder al sitio web de MongoDB Atlas y registrarse.
2. Crear una organización y un proyecto en MongoDB Atlas: "DSI-GRUPOC" en nuestro caso.
3. Crear un clúster en MongoDB Atlas haciendo clic en "Create" en la sección de "Create a deployment", eligiendo el tipo de clúster M0.
4. Dar un nombre al clúster y seleccionar un proveedor de servicios en la nube y una región. En nuestro caso "IkeaRestAPICluster".
5. Crear el clúster pulsando en "Create Deployment".
6. Configurar la autenticación del servidor de base de datos seleccionando "Database Access" en el panel izquierdo, creando un nuevo usuario con nombre de usuario y contraseña específicos, y asignándole el rol "Read and write to any database". Nosotros creamos al usuario `dsiikea`.
7. Configurar el acceso de red seleccionando "Network Access" en el panel izquierdo, borrando las IP existentes y añadiendo la IP `0.0.0.0/`0 para permitir el acceso desde cualquier IP.
8. Acceder al clúster seleccionando "Database" en el panel izquierdo y haciendo clic en "Connect".
9. Seleccionar un método de conexión. Nosotros usamos la extensión de MongoDB de VSCode.
10. Copiar la URL de conexión al cluster generada, sustituyendo `<password>` por la contraseña del usuario de la base de datos creado y especificando la base de datos a la que nos conectaremos.
11. Abrir el cliente de MongoDB, pegar la URL de conexión y hacer clic en "Connect". Ésta URL será la que utilicemos posteriormente en nuestro código para establecer la conexión con la Base de Datos.

#### [📄] Render

Hemos utilizado la herramienta Render para poder desplegar nuestra API Rest en internet. Ésta herramienta nos ofrece una forma de alojar nuestra aplicación para poder acceder a ella en la dirección web que se nos asigne.

Para poder configurarla, se ha hecho uso de la guía proporcionada en los apuntes de la asignatura, que a grandes rasgos se basa en los siguientes pasos:

1. Modificar el archivo `package.json` de forma similar a la guía.
2. Registrarse en Render.
3. En la pantalla principal de Render, hacer clic en "New Web Service" y seleccionar "Build and deploy from a Git repository".
4. Seleccionar el repositorio que contiene el código fuente de la aplicación.
5. Configurar las opciones en el formulario.
6. Hacer clic en "Create Web Service".
7. Esperar y verificar en el log la conexión exitosa a la base de datos MongoDB Atlas.

---

### [🧬] Modelos

Para la implementación de la API, hemos definido una serie de modelos que representan los datos que se almacenan en la base de datos. Dichos modelos los hemos implementado cada uno a partir de una interfaz que extiende de `Document` de Mongoose. A través de éstas interfaces, hemos creado esquemas de MongoDB que definen la estructura de los datos y las operaciones que se pueden realizar sobre ellos.

Ésto nos ha permitido tener una estructura más limpia y ordenada, y poder interactuar con la base de datos de una forma más sencilla y estructurada, permitiéndonos realizar operaciones CRUD sobre los datos de la base de datos y tener un control más preciso sobre los mismos.

#### [👩] Cliente

Definimos un cliente de la siguiente manera:
- `name`: Nombre del cliente. Valor de tipo `String` y requerido.
- `nif`: NIF del cliente. Valor de tipo `String` y requerido.
- `email`: Correo electrónico del cliente. Valor de tipo `String` y opcional.
- `mobilePhone`: Teléfono móvil del cliente. Valor de tipo `Number` y opcional.
- `furniture`: Se trata de un array de pares que contiene la referencia al mueble de la base de datos y la cantidad de las que dispone el cliente. Valor de tipo `Array` y requerido.

#### [📦] Proveedor

Definimos un proveedor de la siguiente manera:
- `name`: Nombre del proveedor. Valor de tipo `String` y requerido.
- `cif`: CIF del proveedor. Valor de tipo `String` y requerido.
- `email`: Correo electrónico del proveedor. Valor de tipo `String` y opcional.
- `mobilePhone`: Teléfono móvil del proveedor. Valor de tipo `Number` y opcional.
- `furniture`: Se trata de un array de pares que contiene la referencia al mueble de la base de datos y la cantidad de la que dispone el proveedor. Valor de tipo `Array` y requerido.


#### [🪑] Mueble

Definimos un mueble de la siguiente manera:
- `name`: Nombre del mueble. Valor de tipo `String` y requerido.
- `description`: Descripción del mueble. Valor de tipo `String` y requerido.
- `color`: Color del mueble. Valor de tipo `String` y requerido. Se ha definido un enum con los colores posibles.
- `price`: Precio del mueble. Valor de tipo `Number` y requerido. Éste valor es validado para que sea positivo.
- `stock`: Stock del mueble. Valor de tipo `Number` y requerido. Por defecto, el stock es 1.

#### [💳] Transacciones

Definimos una transacción de la siguiente manera:
- `participantId`: ID del participante de la transacción. Valor que puede ser de tipos `ProviderDocumentInterface` o  `CustomerDocumentInterface` (dependiendo de si es una transacción de cliente o de usuario) y requerido.
- `transactionType`: Tipo de transacción. Valor de tipo `String` y requerido. Se ha definido un enum con los tipos de transacción posibles.
  - `'Sale To Customer'`: Venta a un cliente.
  - `'Purchase To Provider'`: Compra a un proveedor.
  - `'Return To Provider'`: Devolución a un proveedor.
  - `'Return To Customer'`: Devolución a un cliente.
- `dateTime`: Fecha y hora de la transacción. Valor de tipo `Date` y requerido.
- `totalAmount`: Importe total de la transacción. Valor de tipo `Number` y requerido.
- `details`: Detalles de la transacción. Valor de tipo `String` y opcional.
- `furniture`: Se trata de un array de pares que contiene la referencia al mueble de la base de datos y la cantidad de la que se ha realizado la transacción. Valor de tipo `Array` y requerido.


### [🗃️] Rutas

Hemos definido una serie de rutas que permiten realizar operaciones CRUD sobre los datos de la base de datos. Dichas rutas las hemos implementado en diferentes archivos para mantener una estructura más limpia y ordenada, y dentro del `index.js` hemos importado dichas rutas y las hemos montado en la aplicación. A continuación, se explicarán las rutas implementadas y las decisiones tomadas para su implementación.

#### [👩] Clientes

- **GET /customers**: Busca en la base de datos el cliente especificado en el query de la petición en función de si se ha pasado su id único de la base de datos o su nif. Si no se ha pasado ninguno, devuelve todos los clientes.
Para ello en una primera instancia hemos extraido el nif y hemos creado un filtro con el mismo. Posteriormente hemos utilizado el método `find` de Mongoose para buscar en la base de datos el cliente especificado en el query de la petición.
Si se ha encontrado el cliente, se devuelve un código de estado 200 y el cliente encontrado. Si no se ha encontrado, se devuelve un código de estado 404 y un mensaje de error.

- **GET /customers/:id**: Busca en la base de datos el cliente con el ID especificado en la URL de la petición. Para ello hemos utilizado el método `findById` de Mongoose para buscar en la base de datos el cliente con el ID especificado en la URL de la petición y, si se ha encontrado, se devuelve un código de estado 200 y el cliente encontrado. Si no se ha encontrado, se devuelve un código de estado 404 y un mensaje de error.

- **POST /customers**: Crea un nuevo cliente en la base de datos. Para ello hemos extraido los datos del cliente del cuerpo de la petición y hemos usado `new Customer` para crear un nuevo objeto cliente. Posteriormente hemos utilizado el método `save` de Mongoose para guardar el cliente en la base de datos y, si se ha guardado correctamente, se devuelve un código de estado 201 y el cliente creado. Si no se ha guardado correctamente, se devuelve un código de estado 404 y un mensaje de error.

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