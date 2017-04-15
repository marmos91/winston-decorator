import {logger, LoggerInstance} from '../src/index';
import * as winston from 'winston';
import {expect} from 'chai';

describe('logger', function()
{
    it('should inject the logger correctly', function()
    {
        class test_class
        {
            @logger()
            private _logger: LoggerInstance;
            constructor()
            {
                expect(this._logger).to.be.instanceof(winston.Logger);
            }
        }

        new test_class();
    });

    it('should set the class name as label', function()
    {
        class test_class
        {
            @logger()
            private _logger: LoggerInstance;
            constructor()
            {
                expect(this._logger.transports.console['label']).to.be.equal(this.constructor.name);
            }
        }

        new test_class();
    });

    it('should set the label if specified in options', function()
    {
        let test_label = 'test_label';
        class test_class
        {
            @logger(null, {label: test_label})
            private _logger: LoggerInstance;
            constructor()
            {
                expect(this._logger.transports.console['label']).to.be.equal(test_label);
            }
        }

        new test_class();
    });

    it('should receive a winston.LoggerOptions object as first parameter', function()
    {
        class test_class
        {
            @logger({level: 'debug'})
            private _logger: LoggerInstance;
            constructor()
            {
                expect(this._logger.level).to.be.equal('debug');
            }
        }

        new test_class();
    });

    it('should disable the logger when setting the NODE_ENV variable to test (default)', function()
    {
        process.env['NODE_ENV'] = 'test';
        class test_class
        {
            @logger()
            private _logger: LoggerInstance;
            constructor()
            {
                expect(this._logger.transports.console).to.be.undefined;
            }
        }

        new test_class();
    });

    it('should disable the logger when setting the NODE_ENV variable to specified value (custom)', function()
    {
        process.env['NODE_ENV'] = 'testing_purpose';

        class test_class
        {
            @logger(null, {test_environment: 'testing_purpose'})
            private _logger: LoggerInstance;
            constructor()
            {
                expect(this._logger.transports.console).to.be.undefined;
            }
        }

        new test_class();
    });
});