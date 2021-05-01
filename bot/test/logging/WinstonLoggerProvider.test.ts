import winston from 'winston';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { WinstonLogger } from '../../src/logging/WinstonLoggerProvider';

chai.use(sinonChai);

describe('WinstonLogger', () => {
    let logger: WinstonLogger;
    let winstonLogger: winston.Logger;

    beforeEach(() => {
        winstonLogger = stubInterface<winston.Logger>();
        logger = new WinstonLogger(winstonLogger);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('[logging methods]', () => {
        const args = [1, 2, 3, 'hello world', true, { jon: 'snow' }, [1, 2, 3]];
        const formattedArgs = 'fake-formattedArgs';

        beforeEach(() => {
            sinon.stub(logger, 'format').returns(formattedArgs);
        });

        describe('trace()', () => {
            it('should log with trace level', () => {
                logger.trace(...args);

                expect(winstonLogger.silly).calledOnceWithExactly(formattedArgs);
                expect(logger.format).calledOnceWithExactly(args);
            });
        });

        describe('debug()', () => {
            it('should log with debug level', () => {
                logger.debug(...args);

                expect(winstonLogger.debug).calledOnceWithExactly(formattedArgs);
                expect(logger.format).calledOnceWithExactly(args);
            });
        });

        describe('info()', () => {
            it('should log with info level', () => {
                logger.info(...args);

                expect(winstonLogger.info).calledOnceWithExactly(formattedArgs);
                expect(logger.format).calledOnceWithExactly(args);
            });
        });

        describe('warn()', () => {
            it('should log with warn level', () => {
                logger.warn(...args);

                expect(winstonLogger.warn).calledOnceWithExactly(formattedArgs);
                expect(logger.format).calledOnceWithExactly(args);
            });
        });

        describe('error()', () => {
            it('should log with error level', () => {
                logger.error(...args);

                expect(winstonLogger.error).calledOnceWithExactly(formattedArgs);
                expect(logger.format).calledOnceWithExactly(args);
            });
        });
    });
});
