# Winston Decorator

[![npm](https://img.shields.io/npm/v/npm.svg)]()
[![npm version](https://badge.fury.io/js/winston-decorator.svg)](https://badge.fury.io/js/winston-decorator)
[![Build Status](https://travis-ci.org/marmos91/winston-decorator.svg?branch=master)](https://travis-ci.org/marmos91/winston-decorator)
[![codecov](https://codecov.io/gh/marmos91/winston-decorator/branch/master/graph/badge.svg)](https://codecov.io/gh/marmos91/winston-decorator)
[![Dependencies](https://david-dm.org/marmos91/winston-decorator.svg)](https://david-dm.org/marmos91/winston-decorator.svg)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()


A decorator version of the winston logger written completely in Typescript.

## Installation
`npm install winston-decorator`

## Usage
`winston-decorator` is designed to inject a **winston logger** (see https://github.com/winstonjs/winston) on the decorated property of the given class.

For example:
```typescript
import {logger, LoggerInstance} from 'winston-decorator'

class Test
{
    @logger()
    private _logger;
    
    public constructor()
    {
        this._logger.info('Now I can use the logger from here!');
    }
}
```
You can pass a `winston.LoggerOptions` object to the decorator to specify your settings:
```typescript
@logger({level: 'debug'})
```
or you can put it on a separate settings file if you prefer to change the settings of all your loggers at once.
```typescript
import settings from './settings'
class Test
{
    @logger(settings)
    private _logger;
    
    public constructor()
    {
        this._logger.info('Now I can use the logger from here!');
    }
}
```
The logger comes with a **default label** set on your class name so you can always know from where your log come from.
For example:
```typescript
verbose: [APIServer] Route loaded successfully
debug: [Route] Function called
verbose: [APIServer] Route loaded successfully
info: [APIServer] Listening on port 8080!
```
but you can change it if you want, setting it on the decorator
```typescript
import settings from './settings'
class Test
{
    @logger(settings, {label: 'test'})
    private _logger;
    
    public constructor()
    {
        this._logger.info('This will output <[test] ...>');
    }
}
```
### Test environment
The logger is designed to **automatically hide** all the logs when testing environment is set.
To do so you have to set the `process.env[NODE_ENV]` variable to `"test"` (like this: `NODE_ENV=test node main.js`).
But you can also opt for a custom value for the env_variable. To specify it just pass it to the decorator settings. 

```typescript
import settings from './settings'

class Test
{
    @logger(settings, {test_environment: 'my_custom_env'})
    private _logger;
    
    public constructor()
    {
        this._logger.info('This will be hidden');
    }
}
```
In this case you can run the program with `NODE_ENV=my_custom_env mocha test.js` and hide all the logs from the output.

## Run tests
`npm test`

## Authors
[**Marco Moschettini**](https://github.com/marmos91), [**Alessandro Petraro**](https://github.com/alessandro-p)
