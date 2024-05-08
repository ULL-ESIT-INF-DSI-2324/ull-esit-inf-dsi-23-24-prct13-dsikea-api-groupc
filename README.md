# Práctica 13 - DSIKEA API - GROUP C
## [🙂] Integrantes:
- Mariajose Zuloeta Brito
- Samuel Lorenzo Sánchez
- Adrián Lima García

<p align="center">
  <a> [![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupc?branch=main)
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
- Uso de `express.json()`: Hemos utilizado `express.json()` para poder parsear el cuerpo de las peticiones HTTP en formato JSON.
- Uso de las rutas: Hemos definido las rutas de la API en diferentes archivos para mantener una estructura más limpia y ordenada, y dentro del `index.js` hemos importado dichas rutas y las hemos montado en la aplicación.
- Uso de `express.Router()`: Hemos utilizado el método `express.Router()` para definir las rutas de la API de forma modular y reutilizable.

De nuevo, más adelante se explicará con más detalle cómo se han implementado las rutas.

#### [📖] MongoDB / Mongoose

MongoDB es una base de datos no relacional que hemos utilizado para almacenar los datos de la API. Para interactuar con la base de datos, hemos utilizado Mongoose, que nos permite definir modelos y esquemas para los datos y poder interactuar con la base de datos de una forma más sencilla y estructurada.

En cuanto a las configuraciones que hemos tomado para MongoDB y Mongoose, han sido las siguientes:
- **Conexión a la base de datos**: Hemos definido la URI de conexión a la base de datos en la variable de entorno `MONGODB_URI`.
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

- **GET /customers/:id**: Busca en la base de datos el cliente con el ID especificado en la URL de la petición. Para ello hemos utilizado el método `findById` de Mongoose para buscar en la base de datos el cliente con el ID único y, si se ha encontrado, se devuelve un código de estado 200 y el cliente encontrado. Si no se ha encontrado, se devuelve un código de estado 404 y un mensaje de error.

- **POST /customers**: Crea un nuevo cliente en la base de datos. Para ello hemos extraido los datos del cliente del cuerpo de la petición y hemos usado `new Customer` para crear un nuevo objeto cliente. Posteriormente hemos utilizado el método `save` de Mongoose para guardar el cliente en la base de datos y, si se ha guardado correctamente, se devuelve un código de estado 201 y el cliente creado. Si no se ha guardado correctamente, se devuelve un código de estado 404 y un mensaje de error.

- **PATCH /customers**: Actualiza los detalles de un cliente en la base de datos basado en su NIF. Primero se verifica si se ha proporcionado un NIF en el query de la petición. Si no se proporciona, se devuelve un código de estado 400 junto con un mensaje de error. Luego se definen los campos permitidos para actualización y se verifica si las actualizaciones solicitadas están dentro de los campos permitidos. Si no lo están, se devuelve un código de estado 400 junto con un mensaje de error.
Después, se utiliza el método `findOneAndUpdate` de Mongoose para buscar y actualizar el cliente en la base de datos. Se proporciona el filtro del NIF y los datos de actualización del cuerpo de la petición. Además, se establece la opción `new` como true para devolver el documento actualizado y `runValidators` como true para ejecutar las validaciones definidas en el esquema del modelo.
Si se actualiza correctamente el cliente, se devuelve un código de estado 200 junto con el cliente actualizado. En caso contrario, si el cliente no se encuentra, se devuelve un código de estado 404 y un mensaje de error. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **PATCH /customers/:id**: Actualiza los detalles de un cliente en la base de datos basado en su ID. Se define un conjunto de campos permitidos para la actualización y se verifica si las actualizaciones solicitadas están dentro de los campos permitidos. Si no lo están, se devuelve un código de estado 400 junto con un mensaje de error.
Luego, se utiliza el método `findByIdAndUpdate` de Mongoose para buscar y actualizar el cliente en la base de datos basado en su ID. Se proporciona el ID del cliente y los datos de actualización del cuerpo de la petición. Además, se establece la opción `new` como true para devolver el documento actualizado y `runValidators` como true para ejecutar las validaciones definidas en el esquema del modelo.
Si se actualiza correctamente el cliente, se devuelve un código de estado 200 junto con el cliente actualizado. En caso contrario, si el cliente no se encuentra, se devuelve un código de estado 404 y un mensaje de error. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **DELETE /customers**: Elimina un cliente de la base de datos basado en su NIF. Se determina un filtro basado en el NIF proporcionado en el query de la petición, si se proporciona. Luego, se utiliza el método `findOneAndDelete` de Mongoose para buscar y eliminar el cliente de la base de datos basado en el filtro. Si el cliente se encuentra y se elimina correctamente, se devuelve un código de estado 200 junto con el cliente eliminado. En caso contrario, si el cliente no se encuentra, se devuelve un código de estado 404 y un mensaje de error indicando que el cliente no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **DELETE /customers/:id**: Elimina un cliente de la base de datos basado en su ID. Se utiliza el método `findByIdAndDelete` de Mongoose para buscar y eliminar el cliente de la base de datos basado en su ID. Si el cliente se encuentra y se elimina correctamente, se devuelve un código de estado 200 junto con el cliente eliminado. En caso contrario, si el cliente no se encuentra, se devuelve un código de estado 404 y un mensaje de error indicando que el cliente no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

#### [📦] Proveedores

- **GET /providers**: Obtiene todos los proveedores o un proveedor específico según su CIF o ID. Se establece un filtro inicial como un objeto vacío. Luego, se evalúan las diferentes combinaciones de parámetros de consulta (`cif`, `id`) para construir el filtro adecuado. Se utiliza el método `find` de Mongoose para buscar en la base de datos los proveedores que coincidan con el filtro especificado. Si se encuentran proveedores y la lista no está vacía, se devuelve un código de estado 200 junto con los proveedores encontrados. En caso contrario, si no se encuentran proveedores que coincidan con el filtro, se devuelve un código de estado 404. Si no se proporciona un CIF o un ID en la consulta, se devuelve un código de estado 400 junto con un mensaje indicando que se debe proporcionar un CIF o un ID. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **GET /providers/:id**: Obtiene un proveedor específico de la base de datos basado en su ID. Se utiliza el método `findById` de Mongoose para buscar el proveedor por su ID único en la base de datos. Si se encuentra el proveedor, se devuelve un código de estado 200 junto con el proveedor encontrado. En caso contrario, si el proveedor no se encuentra, se devuelve un código de estado 404. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **POST /providers**: Crea un nuevo proveedor en la base de datos. Se crea un nuevo objeto proveedor utilizando los datos proporcionados en el cuerpo de la petición. Luego, se utiliza el método `save` de Mongoose para guardar el proveedor en la base de datos. Si la operación se completa correctamente, se devuelve un código de estado 201 junto con el proveedor creado. En caso de que ocurra algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error indicando la causa del problema.

- **PATCH /providers**: Actualiza los detalles de un proveedor en la base de datos basado en su CIF. Se verifica si se proporciona el CIF del proveedor en el query de la petición. Si no se proporciona, se devuelve un código de estado 400 junto con un mensaje indicando que el CIF es requerido.
Luego, se verifica si las actualizaciones solicitadas están dentro de los campos permitidos. Si no lo están, se devuelve un código de estado 400 y un mensaje indicando que las actualizaciones no están permitidas.
Se utiliza el método `findOneAndUpdate` de Mongoose para buscar y actualizar el proveedor en la base de datos basado en su CIF. Se proporciona el CIF del proveedor y los datos de actualización del cuerpo de la petición. Además, se establece la opción `new` como true para devolver el documento actualizado y `runValidators` como true para ejecutar las validaciones definidas en el esquema del modelo.
Si se actualiza correctamente el proveedor, se devuelve un código de estado 200 junto con el proveedor actualizado. En caso contrario, si el proveedor no se encuentra, se devuelve un código de estado 404. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **PATCH /providers/:id**: Actualiza los detalles de un proveedor en la base de datos basado en su ID. Se verifica si las actualizaciones solicitadas están dentro de los campos permitidos. Si no lo están, se devuelve un código de estado 400 y un mensaje indicando que las actualizaciones no están permitidas.
Se utiliza el método `findByIdAndUpdate` de Mongoose para buscar y actualizar el proveedor en la base de datos basado en su ID proporcionado en la URL de la petición. Se proporciona el ID del proveedor y los datos de actualización del cuerpo de la petición. Además, se establece la opción `new` como true para devolver el documento actualizado y `runValidators` como true para ejecutar las validaciones definidas en el esquema del modelo.
Si se actualiza correctamente el proveedor, se devuelve un código de estado 200 junto con el proveedor actualizado. En caso contrario, si el proveedor no se encuentra, se devuelve un código de estado 404. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **DELETE /providers**: Elimina un proveedor de la base de datos basado en su CIF. Se verifica si se proporciona el CIF del proveedor en el query de la petición. Si no se proporciona, se devuelve un código de estado 400 junto con un mensaje indicando que el CIF es requerido.
Se utiliza el método `findOne` de Mongoose para buscar el proveedor en la base de datos basado en su CIF. Si se encuentra el proveedor, se devuelve un código de estado 200 junto con el proveedor encontrado. En caso contrario, si el proveedor no se encuentra, se devuelve un código de estado 404 y un mensaje indicando que el proveedor no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **DELETE /providers/:id**: Elimina un proveedor de la base de datos basado en su ID. Se utiliza el método `findByIdAndDelete` de Mongoose para buscar y eliminar el proveedor de la base de datos basado en su ID proporcionado en la URL de la petición. Si se encuentra el proveedor y se elimina correctamente, se devuelve un código de estado 200 junto con el proveedor eliminado. En caso contrario, si el proveedor no se encuentra, se devuelve un código de estado 404 y un mensaje indicando que el proveedor no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

#### [🪑] Muebles

- **GET /furnitures**: Obtiene todos los muebles o un mueble específico según su nombre, descripción o color. Se establece un filtro inicial como un objeto vacío. Luego, se evalúan las diferentes combinaciones de parámetros de consulta (`name`, `description`, `color`) para construir el filtro adecuado. Se utiliza el método find de Mongoose para buscar en la base de datos los muebles que coincidan con el filtro especificado. Si se encuentran muebles y la lista no está vacía, se devuelve un código de estado 200 junto con los muebles encontrados. En caso contrario, si no se encuentran muebles que coincidan con el filtro, se devuelve un código de estado 404 y un mensaje indicando que el mueble no se encontró. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **GET /furnitures/:id**: Obtiene un mueble específico de la base de datos basado en su ID. Se utiliza el método `findById` de Mongoose para buscar el mueble en la base de datos basado en su ID proporcionado en la URL de la petición. Si se encuentra el mueble, se devuelve un código de estado 200 junto con el mueble encontrado. En caso contrario, si el mueble no se encuentra, se devuelve un código de estado 404 y un mensaje indicando que el mueble no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **POST /furnitures**: Crea un nuevo mueble en la base de datos. Se crea un nuevo objeto mueble utilizando los datos proporcionados en el cuerpo de la petición. Luego, se utiliza el método save de Mongoose para guardar el mueble en la base de datos. Si la operación se completa correctamente, se devuelve un código de estado 201 junto con el mueble creado. En caso de que ocurra algún error de validación, se devuelve un código de estado 400 y un mensaje de error detallando la causa del problema.

- **PATCH /furnitures**: Actualiza los detalles de un mueble en la base de datos basado en su nombre. Se verifica si se proporciona el nombre del mueble en el query de la petición. Si no se proporciona, se devuelve un código de estado 400 junto con un mensaje indicando que el nombre es requerido. Luego, se verifica si las actualizaciones solicitadas están dentro de los campos permitidos. Si no lo están, se devuelve un código de estado 400 y un mensaje indicando que las actualizaciones son inválidas. Se utiliza el método `findOne` de Mongoose para buscar el mueble basado en el nombre proporcionado en el query de la petición. Si se encuentra el mueble, se actualizan los campos especificados en el cuerpo de la petición y se guarda el mueble actualizado en la base de datos. Se devuelve el mueble actualizado. Si el mueble no se encuentra, se devuelve un código de estado 404 y un mensaje indicando que el mueble no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 400 y un mensaje de error indicando la causa del problema.

- **PATCH /furnitures/:id**: Actualiza los detalles de un mueble en la base de datos basado en su ID.
Estrategia: Se verifica si las actualizaciones solicitadas están dentro de los campos permitidos. Si no lo están, se devuelve un código de estado 400 y un mensaje indicando que las actualizaciones son inválidas.
Se utiliza el método `findByIdAndUpdate` de Mongoose para buscar y actualizar el mueble en la base de datos basado en su ID. Se proporciona el ID del mueble y los datos de actualización del cuerpo de la petición. Además, se establece la opción `new` como true para devolver el documento actualizado y `runValidators` como true para ejecutar las validaciones definidas en el esquema del modelo.
Si se actualiza correctamente el mueble, se devuelve un código de estado 200 junto con el mueble actualizado. En caso contrario, si el mueble no se encuentra, se devuelve un código de estado 404 y un mensaje indicando que el mueble no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 400 y un mensaje de error indicando la causa del problema.

- **DELETE /furnitures**: Elimina un mueble de la base de datos basado en su nombre. Se verifica si se proporciona el nombre del mueble en el query de la petición. Si no se proporciona, se devuelve un código de estado 400 junto con un mensaje indicando que el nombre es requerido.
Se utiliza el método `findOneAndDelete` de Mongoose para buscar y eliminar el mueble de la base de datos basado en el nombre proporcionado en el query de la petición. Si se encuentra y se elimina correctamente el mueble, se devuelve un código de estado 200 junto con el mueble eliminado. En caso contrario, si el mueble no se encuentra, se devuelve un código de estado 404 y un mensaje indicando que el mueble no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error indicando la causa del problema.

- **DELETE /furnitures/:id**: Elimina un mueble de la base de datos basado en su ID. Se utiliza el método `findByIdAndDelete` de Mongoose para buscar y eliminar el mueble de la base de datos basado en su ID proporcionado en la URL de la petición. Si se encuentra y se elimina correctamente el mueble, se devuelve un código de estado 200 junto con el mueble eliminado. En caso contrario, si el mueble no se encuentra, se devuelve un código de estado 404 y un mensaje indicando que el mueble no fue encontrado. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error indicando la causa del problema.

#### [💳] Transacciones

- **GET /transactions**: Obtiene transacciones filtradas por el ID único. Se establece un filtro inicial como un objeto vacío. Luego, se evalúan las diferentes combinaciones de parámetros de consulta (`nif`, `cif`) para construir el filtro adecuado. Se utiliza el método `find` de Mongoose para buscar en la base de datos las transacciones que coincidan con el filtro especificado. Si se encuentran transacciones y la lista no está vacía, se devuelve un código de estado 200 junto con las transacciones encontradas. En caso contrario, si no se encuentran transacciones que coincidan con el filtro, se devuelve un código de estado 404. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **GET /transactions/:id**: Obtiene una transacción específica de la base de datos basada en su ID. Se utiliza el método `findById` de Mongoose para buscar la transacción en la base de datos basada en su ID proporcionado en la URL de la petición. Si se encuentra la transacción, se devuelve un código de estado 200 junto con la transacción encontrada. En caso contrario, si la transacción no se encuentra, se devuelve un código de estado 404. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **GET /transactions**: Obtiene transacciones filtradas por tipo de transacción. Se establece un filtro inicial basado en el parámetro de consulta `transactionType`, si está presente en la solicitud. Si se proporciona `transactionType`, se construye el filtro para buscar transacciones con ese tipo de transacción. Se utiliza el método `find` de Mongoose para buscar en la base de datos las transacciones que coincidan con el filtro especificado. Si se encuentran transacciones y la lista no está vacía, se devuelve un código de estado 200 junto con las transacciones encontradas. En caso contrario, si no se encuentran transacciones que coincidan con el filtro, se devuelve un código de estado 404. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **GET /transactions**: Obtiene transacciones filtradas por fecha y hora. Se establece un filtro inicial basado en el parámetro de consulta `dateTime`, si está presente en la solicitud. Si se proporciona `dateTime`, se construye el filtro para buscar transacciones con esa fecha y hora. Se utiliza el método `find` de Mongoose para buscar en la base de datos las transacciones que coincidan con el filtro especificado. Si se encuentran transacciones y la lista no está vacía, se devuelve un código de estado 200 junto con las transacciones encontradas. En caso contrario, si no se encuentran transacciones que coincidan con el filtro, se devuelve un código de estado 404 junto con un mensaje indicando que no se pudo encontrar ninguna transacción con la entrada proporcionada. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **POST /transactions**: Crea una nueva transacción en la base de datos. Se verifica si el participante especificado existe como cliente o proveedor en la base de datos. Si no se encuentra, se devuelve un código de estado 404 con un mensaje indicando que el participante no fue encontrado. Luego, se comprueba si el participante es un proveedor o un cliente. Se valida el tipo de transacción y se realizan las operaciones correspondientes según el tipo de transacción especificado. Se verifica si los muebles requeridos están disponibles y se actualizan los registros de stock y muebles del participante. Se calcula el monto total de la transacción y se crea un nuevo objeto de transacción. Finalmente, se guarda la transacción en la base de datos y se devuelve un código de estado 201 junto con la transacción creada. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **DELETE /transactions/:id**: Elimina una transacción de la base de datos basada en su ID. Se utiliza el método `findByIdAndDelete` de Mongoose para buscar y eliminar la transacción de la base de datos basada en su ID único. Se verifican varias condiciones relacionadas con la integridad de los datos antes de eliminar la transacción. Se comprueba si la transacción existe y si el participante asociado aún existe como cliente o proveedor. Se realiza una verificación adicional según el tipo de transacción para asegurarse de que el participante sea el tipo correcto (cliente o proveedor) y se actualiza el stock de los muebles correspondientes en consecuencia. Finalmente, si la transacción se elimina correctamente, se devuelve un código de estado 200 junto con un mensaje de éxito y los detalles de la transacción eliminada. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 y un mensaje de error.

- **PATCH /transactions/:id**: Actualiza una transacción específica en la base de datos basada en su ID.
Estrategia: Se valida si las actualizaciones proporcionadas son permitidas, es decir, si corresponden a los campos `details` y `furniture`. Si alguna de las actualizaciones no está permitida, se devuelve un código de estado 400 junto con un mensaje indicando que las actualizaciones son inválidas. Luego, se utiliza el método `findOneAndUpdate` de Mongoose para buscar y actualizar la transacción en la base de datos basada en su ID proporcionado en la URL de la petición. Si se encuentra y se actualiza la transacción correctamente, se devuelve un código de estado 200 junto con la transacción actualizada. En caso contrario, si la transacción no se encuentra, se devuelve un código de estado 404 junto con un mensaje indicando que la transacción no existe. Si ocurre algún error durante el proceso, se devuelve un código de estado 500 junto con un mensaje de error.

### [🧪] Pruebas

Para realizar las pruebas de la API, hemos utilizado la herramienta `ThunderClient` en una primera instancia, que nos permite realizar peticiones HTTP a nuestra API y comprobar que los resultados obtenidos son los esperados. Tras ésto, hemos automatizado las pruebas utilizando `Supertest` que nos permiten realizar pruebas unitarias y de integración sobre nuestra API.

#### [👩] Clientes

Las pruebas realizadas para la gestión de clientes (`CUSTOMERS`) se centran en verificar el correcto funcionamiento de las rutas y métodos asociados a la creación, obtención, actualización y eliminación de clientes en la aplicación.

1. **Pruebas de obtención de clientes**:
   - Se realizaron pruebas para confirmar que los clientes pueden obtenerse correctamente de la base de datos utilizando diferentes criterios de búsqueda, como el NIF y el ID.
   - Por ejemplo, se probó que la ruta `GET /customers?nif={nif}` devuelve correctamente un cliente según su NIF.

2. **Pruebas de creación de clientes**:
   - Se realizaron pruebas para verificar que la ruta `POST /customers` crea nuevos clientes en la base de datos correctamente.
   - Las pruebas cubren casos donde la creación es exitosa, así como casos donde no se proporcionan datos suficientes o se proporcionan datos incorrectos.

3. **Pruebas de actualización de clientes**:
   - Se realizaron pruebas para verificar que la ruta `PATCH /customers` actualice los clientes existentes en la base de datos.
   - Las pruebas cubren escenarios donde la actualización es exitosa, así como casos donde se proporcionan datos incorrectos o se intenta actualizar un cliente inexistente.

4. **Pruebas de eliminación de clientes**:
   - Se realizaron pruebas para verificar que la ruta `DELETE /customers` elimine correctamente los clientes de la base de datos.
   - Además, se probaron casos donde se intenta eliminar un cliente inexistente o se proporciona un ID no válido.


#### [📦] Proveedor

Las pruebas realizadas para la gestión de proveedores (`PROVIDERS`) se enfocan en verificar el correcto funcionamiento de las rutas y métodos asociados a la creación, obtención, actualización y eliminación de proveedores en la aplicación.

1. **Pruebas de obtención de proveedores**:
   - Se realizaron pruebas para confirmar que los proveedores pueden obtenerse correctamente de la base de datos utilizando diferentes criterios de búsqueda, como el CIF y el ID.
   - Por ejemplo, se probó que la ruta `GET /providers?cif={cif}` devuelve correctamente un proveedor según su CIF.

2. **Pruebas de creación de proveedores**:
   - Se realizaron pruebas para verificar que la ruta `POST /providers` cree nuevos proveedores en la base de datos correctamente.
   - Las pruebas cubren casos donde la creación es exitosa, así como casos donde no se proporcionan datos suficientes o se proporcionan datos incorrectos.

3. **Pruebas de actualización de proveedores**:
   - Se realizaron pruebas para verificar que la ruta `PATCH /providers` actualice los proveedores existentes en la base de datos.
   - Las pruebas cubren escenarios donde la actualización es exitosa, así como casos donde se proporcionan datos incorrectos o se intenta actualizar un proveedor inexistente.

4. **Pruebas de eliminación de proveedores**:
   - Se realizaron pruebas para verificar que la ruta `DELETE /providers` elimine correctamente los proveedores de la base de datos.
   - Además, se probaron casos donde se intenta eliminar un proveedor inexistente o se proporciona un ID no válido.

#### [🪑] Muebles

Las pruebas realizadas para la gestión de muebles (`FURNITURES`) se enfocan en verificar el correcto funcionamiento de las rutas y métodos asociados a la creación, obtención, actualización y eliminación de muebles en la aplicación.

1. **Pruebas de obtención de muebles**:
    - Se realizaron varias pruebas para confirmar que los muebles se pueden obtener correctamente de la base de datos utilizando diferentes criterios de búsqueda, como el ID, el nombre, la descripción y el color.
    - Por ejemplo, se probó que la ruta `GET /furnitures?id={id}` devuelve correctamente un mueble según su ID.

2. **Pruebas de creación de muebles**:
    - Se realizaron pruebas para verificar que la ruta `POST /furnitures` crea nuevos muebles en la base de datos correctamente.
    - Las pruebas cubren casos donde la creación es exitosa, así como casos donde no se proporcionan datos suficientes o se proporcionan datos incorrectos.

3. **Pruebas de actualización de muebles**:
    - Se realizaron pruebas para verificar que la ruta `PATCH /furnitures/:id` actualice los muebles existentes en la base de datos.
    - Las pruebas cubren escenarios donde la actualización es exitosa, así como casos donde se proporcionan datos incorrectos o se intenta actualizar un mueble inexistente.

4. **Pruebas de eliminación de muebles**:
    - Se realizaron pruebas para verificar que la ruta `DELETE /furnitures/:id` elimine correctamente los muebles de la base de datos.
    - Además, se probaron casos donde se intenta eliminar un mueble inexistente o se proporciona un ID no válido.

#### [💳] Transacciones

Estas pruebas para la gestión de transacciones (`TRANSACTIONS`) en la aplicación cubren una amplia gama de casos para garantizar que el sistema funcione correctamente y maneje adecuadamente los posibles errores.

1. **Pruebas de obtención de transacciones**:
   - Se realizaron pruebas para confirmar que las transacciones pueden obtenerse correctamente de la base de datos utilizando diferentes criterios de búsqueda, como el ID de transacción, tipo de transacción, fecha, NIF y CIF.
   - Las pruebas incluyen casos donde se espera encontrar transacciones y casos donde no se encuentran.

2. **Pruebas de creación de transacciones**:
   - Se realizaron pruebas para verificar que las nuevas transacciones se puedan crear correctamente en la base de datos.
   - Las pruebas cubren escenarios donde las transacciones son exitosas y se crean con la información correcta, así como casos donde se proporciona información incorrecta o faltante.

3. **Pruebas de actualización de transacciones**:
   - Se realizaron pruebas para verificar que las transacciones existentes se puedan actualizar correctamente en la base de datos.
   - Las pruebas incluyen escenarios donde las actualizaciones son exitosas y casos donde se intentan actualizar transacciones con información incorrecta o inválida.

4. **Pruebas de eliminación de transacciones**:
   - Se realizaron pruebas para verificar que las transacciones existentes se puedan eliminar correctamente de la base de datos.
   - Las pruebas cubren escenarios donde las eliminaciones son exitosas y casos donde se intentan eliminar transacciones que no existen o donde hay problemas con los participantes o los muebles involucrados. También se verificó el stock de los muebles después de eliminar una transacción.

#### [🚀] WORKFLOWS

Se realizaron pruebas de integración para verificar que los diferentes componentes de la aplicación funcionen correctamente juntos. Las pruebas cubren casos donde se realizan operaciones CRUD en diferentes rutas y se verifican los resultados esperados.

1. **Crear una transacción de venta al cliente:**
   - Se crea un cliente y un mueble.
   - Se envía una solicitud para crear una transacción de venta al cliente con la información del cliente y del mueble.
   - Se espera que la transacción se cree exitosamente.
   - Se espera que el stock del mueble se actualice correctamente.
   - Se espera que el monto total de la transacción sea correcto.
   - Se verifica que si se intenta crear una transacción con un stock de 0, se reciba un error adecuado.

2. **Crear una transacción de compra al proveedor:**
   - Se intenta crear una transacción de compra al proveedor.
   - Se espera que esta transacción no se cree exitosamente debido a ciertas condiciones, como que el proveedor no tenga el mueble en stock.
   - Se espera que el stock del mueble se actualice correctamente.
   - Se espera que el monto total de la transacción sea correcto.
   - Se verifica que el proveedor tenga el mueble asociado antes de crear la transacción.

3. **Eliminar una transacción de venta al cliente:**
   - Se crea una transacción de venta al cliente.
   - Se intenta eliminar esta transacción.
   - Se espera que la transacción se elimine correctamente.
   - Se verifica que si el cliente asociado a la transacción se elimina, se reciba un error adecuado.
   - Se verifica que si el mueble asociado a la transacción se elimina, se reciba un error adecuado.
   - Se verifica que el stock del mueble se actualice correctamente después de eliminar la transacción.

4. **Eliminar una transacción de compra al proveedor:**
   - Se crea una transacción de compra al proveedor.
   - Se intenta eliminar esta transacción.
   - Se espera que la transacción se elimine correctamente.
   - Se verifica que si el proveedor asociado a la transacción se elimina, se reciba un error adecuado.
   - Se verifica que si el mueble asociado a la transacción se elimina, se reciba un error adecuado.
   - Se verifica que el stock del mueble se actualice correctamente después de eliminar la transacción.

5. **Actualizar una transacción de venta al cliente:**
   - Se crea una transacción de venta al cliente.
   - Se intenta actualizar esta transacción.
   - Se espera que la transacción se actualice correctamente.
   - Se verifica que si el cliente asociado a la transacción se elimina, se reciba un error adecuado.
   - Se verifica que si el mueble asociado a la transacción se elimina, se reciba un error adecuado.

6. **Actualizar una transacción de compra al proveedor:**
   - Se crea una transacción de compra al proveedor.
   - Se intenta actualizar esta transacción.
   - Se espera que la transacción se actualice correctamente.
   - Se verifica que si el proveedor asociado a la transacción se elimina, se reciba un error adecuado.
   - Se verifica que si el mueble asociado a la transacción se elimina, se reciba un error adecuado.

## [💭] Conclusiones

En esta práctica hemos aprendido a crear una API REST para la tienda de muebles propuesta (DSIKEA) utilizando Node.js, Express, Mongoose y MongoDB. Hemos definido diferentes rutas para gestionar clientes, proveedores, muebles y transacciones en la aplicación además de los esquemas de datos necesarios para cada uno de estos componentes. Hemos implementado las operaciones CRUD para cada uno de estos componentes y hemos realizado pruebas unitarias y de integración para verificar que la API funcione correctamente y maneje adecuadamente los posibles errores.

Además, hemos aprendido a desplegar aplicaciones en éste caso mediante la herramienta Render, además de aprender a utilizar MongoDB Atlas para almacenar la base de datos en la nube.

Los miembros del grupo consideramos que la práctica ha sido muy interesante y nos ha permitido aprender mucho sobre el desarrollo de aplicaciones web y APIs REST con Node.js y MongoDB, pudiendo aplicar los conocimientos adquiridos en la asignatura de Desarrollo de Sistemas Informáticos.

## [📚] Bibliografía

- [Enunciado de la práctica](https://ull-esit-inf-dsi-2324.github.io/prct13-DSIkea-api/)
- [Apuntes de la asignatura sobre NodeJS](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/)
- [Documentación para la instalación de MongoDB en Ubuntu](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-mongodb.html)
- [Documentación sobre el despliegue con MongoDB Atlas y Render](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-deployment.html)