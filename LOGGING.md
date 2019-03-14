# Logging
This application uses Bunyan structured logging. See [Bunyan](https://github.com/trentm/node-bunyan) logging project for more.

## Configuration

Set the logging configuration in either common.json or _NODE_ENV_.json


```json
"logging": {
    "level": "debug",
    "file": {
        "path": "./logs/api-template.log",
        "format": "structured"
    },
    "stdout": {
        "format": "pretty"
    }
}
```

Logging may output to both file or stdout. The recommended approach is to have structured logging (JSON) for file, and pretty for console.

## Docker
Docker containers __should__ not log to the file system but to stdout which is captured by the docker logging daemon. This logging should be structured.