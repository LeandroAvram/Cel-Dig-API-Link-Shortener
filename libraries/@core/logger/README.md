# Librería @core/logger

## Descripción
Wrapper a la librería [winston](https://github.com/winstonjs/winston#winston) para log.

Funcionalidades:
* Facilita el log del archivos origen (parámetro fileName)
* Facilita el log de errores, con trace y objetos
* Se integra con la librería [@core/http-context](https://bitbucket.personal.corp:8443/projects/CORE/repos/http-context/) para log de trackId y parámetros
* Obfusca datos sensibles de trace de Axios
* Dispone de 2 transports: para ambiente local (con formateo y colores) y ejecución en servers (json plano)

## Instalación

* Configurar el registry de npm (requerido una única vez)
    ```
    npm config set registry https://plcldbeesapp3:8443/artifactory/api/npm/npm/
    npm config set @core:registry https://plcldbeesapp3:8443/artifactory/api/npm/npm/
    npm config set strict-ssl false
    ```

* Ejecutar:

    ```
    npm i @core/logger
    ```    

## Uso
### Crear un logger
En cada archivo que se quiera hacer uso del logger, incluir la siguiente línea:

    
    const logger = require('@core/logger').createLogger({ fileName: __filename })
    

Luego utilizar el objeto logger con la API habitual de [winston](https://github.com/winstonjs/winston#winston):

    
    logger.info('Mensage de prueba')
    

### Uso de etiquetas
Se pueden agregar etiquetas globales en la creación del logger:

    const logger = require('@core/logger').createLogger({ fileName: __filename, meta: { brand: 'ARNET', opt: 'DEBT' } })

### Medición de tiempos
Para medir tiempos de ejecución utilizar un código como el siguiente:

    const profiler = logger.startTimer()
    // hacer algo
    profiler.done({ message: 'ws-TransactionX' })

### Log de objetos
El log de objetos respeta la API de [winston](https://github.com/winstonjs/winston#winston):

    logger.info('Mensage de prueba', { categoria : 'test', puntuacion: 5 })

### Log de errores
El log de errores se puede realizar de las siguiente maneras:
* Solo mensaje
    ```
    logger.error('Mensaje de error')
    ```
* Mensaje y objeto
    ```
    logger.error('Parámetro LineNumber no es válido.', { opcion: 'VALIDATION' })
    ```
* Mensaje y trace
    ```
    try {
      ...
    } catch (err) {
      logger.error('Mensaje de error', err)
    }
    ```
* Mensaje, trace y objeto
    ```
    try {
      ...
    } catch (err) {
      logger.error('Mensaje de error', err, { serviceName: 'consultaDeuda' })
    }
    ```
### Log de trackId y parámetros
En caso de estar disponibles, se incluirán en los logs el trackId y los parámetros del contexto. Sólo es necesario instalar la libreria [@core/http-context](https://bitbucket.personal.corp:8443/projects/CORE/repos/http-context/).

### Formato en ambiente local
En caso de que la variable NODE_ENV sea 'lo' o 'integration-test' el logger se producirá en formato human-readable y con colores.
En otros casos, se produce log por consola en json plano (apto para consumo en CloudWatch).

## Versiones

* 1.0.0
    - Version inicial

* 1.0.3
    - Se corrigen dependencias
    - Se agrega documentación
