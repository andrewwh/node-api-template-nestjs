export interface LoggingConfiguration {
    level: string;
    file?: {
        path: string;
        format: 'structured' | 'pretty'
    };
    stdout?: {
        path: string;
        format: 'structured' | 'pretty'
    };
};

export interface CommonConfiguration {
    port: number;
    host: string;
    basePath: string;
    logging: LoggingConfiguration;
};

export interface Configuration extends CommonConfiguration {
    // Application configuration here
};