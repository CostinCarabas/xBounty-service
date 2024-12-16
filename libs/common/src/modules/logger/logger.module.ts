import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { logTransports } from './log-transports';
import { Logger } from './logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => {
        return {
          transports: logTransports,
        };
      },
    }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule { }
