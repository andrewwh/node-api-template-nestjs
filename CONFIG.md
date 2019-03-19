# Configuration
The configuration system uses a mix of configuration files and environment variables.

## Configuration file heirarchy
Primarily configuration is stored in a structured JSON object. These files are stored in the [config](src/config) directory. This can be overriden by setting the CONFIG_DIR environment variable.

Common configuration is stored in common.js and is merged with environment specific files named after the environment variable _NODE_ENV_. So if _NODE_ENV_ is test, then configuration is common.json + test.json. Where _NODE_ENV_ is not set, then default.json is used.

__Important__: Do not store secrets in these configuration files.

### Overwrite at runtime
It is possible to overwrite these files (or just default.json) before the application starts for environment specific settings. This is not the recommended approach. See _Environment variables_ below.

## Environment variables
Once a configuration file has been loaded into memory individual configuration key value pairs may be overridden from environemnt variables.

Given a configuration as:
```json
{
    "host": "localhost",
    "port": 8080,
    "password": null,
    "serviceX": {
        "url": "https://service.com",
        "password": null
    }
}
```
1. Setting the environment variable _PASSWORD=pwd1_ will set the root level password to pwd1.
2. Setting the environment variable _SERVICEX_PASSWORD=pwd2_ will set the password for serviceX to pwd2.

### For use with Docker and Kubernetes
Both docker and kubernetes can inject environment variables before the process is started. Kubernetes has in built secret management which can write to either the file system or environment variables. You should prefer using environment variables*.

To start this service in a container:
1. Set _NODE_ENV_ to the name of the environment the container is starting in.
2. Set any secrets as environment variables

\* For most cases you should prefer to start a docker container with a readonly filesystem.
