import * as winston from 'winston';
import {LoggerInstance} from 'winston';
import {type} from 'os';

/**
 * Options interface for the logger decorator
 * @interface
 * @author Marco Moschettini Alessandro Petraro
 * @version 0.0.1
 */
export interface DecoratorOptions
{
    /**
     * If specified it sets the label for the injected logger
     */
    label?: string;

    /**
     * If specified it sets the environment variable to disable the logger onto
     */
    test_environment?: string;
}

/**
 * Decorator that injects a logger in the given class
 * @param settings {winston.LoggerOptions} see https://github.com/winstonjs/winston
 * @param options {DecoratorOptions} (optional)
 * @author Marco Moschettini Alessandro Petraro
 * @version 0.0.1
 */
export function logger(settings?: winston.LoggerOptions | DecoratorOptions, options?: DecoratorOptions)
{
    return function(target: any, key: string | symbol)
    {
        let test_env = (options && options.test_environment) || 'test';
        if(process.env.NODE_ENV !== test_env)
        {
            let label = (options && options.label) || (target.name || target.constructor.name);

            let logger = new (winston.Logger)(settings);
            logger.add(winston.transports.Console, {label});
            target.constructor.prototype[key] = logger;
        }
        else
        {
            let logger = new (winston.Logger)(settings);
            logger.add(winston.transports.File, {filename: '/dev/null'});
            target.constructor.prototype[key] = logger;
        }
    }
}

export {LoggerInstance};