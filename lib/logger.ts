
export interface LogMeta {
    [key: string]: any;
}

class Logger {
    private log(level: 'info' | 'error', message: string, meta?: LogMeta) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            level,
            message,
            meta,
            timestamp,
        };
        if (level === 'error') {
            console.error(JSON.stringify(logEntry));
        } else {
            console.log(JSON.stringify(logEntry));
        }
    }

    info(message: string, meta?: LogMeta) {
        this.log('info', message, meta);
    }

    error(message: string, meta?: LogMeta) {
        this.log('error', message, meta);
    }
}

export const logger = new Logger();
