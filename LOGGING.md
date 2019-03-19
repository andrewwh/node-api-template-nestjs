# Logging
This application uses Bunyan structured logging. See [Bunyan](https://github.com/trentm/node-bunyan) logging project for more. However, this is an implementation detail and is not visible to the client.

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

## Using the logger
Inject the logger into any class that is either a _controller_ or is _injectable_

```javascript
import {Logger} from './service/core/logger';

@Controller()
export class MyController {
    constructor(@Inject('Logger') private logger: Logger) {}
}
```

## Docker
Docker containers __should__ not log to the file system but to stdout which is captured by the docker logging daemon. This logging should be structured.