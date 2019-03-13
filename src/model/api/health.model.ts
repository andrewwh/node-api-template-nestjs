export interface Health {
    name: string;
    version: string;
    time: Date;
}

export interface ApplicationInfo extends Health {
    uptime: number;
    memory: {
        rss?: number;
        heapTotal?: number;
        heapUsed?: number;
        external?: number;
      };
    cpu: {
        user?: number;
        system?: number;
    };    
}