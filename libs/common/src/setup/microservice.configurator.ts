import { VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor, MetricsService, RequestCpuTimeInterceptor } from '@multiversx/sdk-nestjs-monitoring';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiErrorLoggingInterceptor } from '../interceptors';
import { Logger } from '../modules';

/** This must be imported by app directly from @XBounty/common/setup, not from @XBounty/common. */
export class MicroserviceConfigurator {
  private nestApplication: NestExpressApplication | undefined;

  async create(
    module: unknown,
  ): Promise<void> {
    this.nestApplication = await NestFactory.create<NestExpressApplication>(module, {
      rawBody: true,
    });
  }

  enableShutdownHooks(): void {
    if (!this.nestApplication) {
      return;
    }

    this.nestApplication.enableShutdownHooks();
  }

  setup(): void {
    if (!this.nestApplication) {
      return;
    }

    this.nestApplication.useBodyParser('json', {
      limit: '1mb',
    });

    this.nestApplication.enableCors();
    this.useMetricsInterceptors();
  }

  listen(port: number): void {
    if (!this.nestApplication) {
      return;
    }

    this.nestApplication.listen(port, () => {
      console.log(`Listening on port: ${port}.`);
    });
  }

  private useMetricsInterceptors(): void {
    if (!this.nestApplication) {
      return;
    }

    const metricsService =
      this.nestApplication.get<MetricsService>(MetricsService);

    const logger =
      this.nestApplication.get<Logger>(Logger);

    this.nestApplication.useGlobalInterceptors(
      new ApiErrorLoggingInterceptor(logger),
      new LoggingInterceptor(metricsService),
      new RequestCpuTimeInterceptor(metricsService),
    );
  }

  useVersioning(): void {
    if (!this.nestApplication) {
      return;
    }

    this.nestApplication.enableVersioning({
      type: VersioningType.URI,
      prefix: 'api/v',
      defaultVersion: '1',
    });
  }

  enableTrustProxy(): void {
    if (!this.nestApplication) {
      return;
    }

    this.nestApplication.enable('trust proxy');
  };

  setKeepAliveTimeout(keepAliveTimeout: number): void {
    if (!this.nestApplication) {
      return;
    }

    const httpAdapterHostService = this.nestApplication.get<HttpAdapterHost>(HttpAdapterHost);
    const httpServer = httpAdapterHostService.httpAdapter.getHttpServer();
    httpServer.keepAliveTimeout = keepAliveTimeout;
  }

  useSwagger(): void {
    if (!this.nestApplication) {
      return;
    }

    const documentBuilder = new DocumentBuilder()
      .setTitle('XBounty')
      .setDescription('')
      .setVersion('1.0.0')
      .setExternalDoc('MultiversX Docs', 'https://docs.multiversx.com')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'JWT',
      );

    const config = documentBuilder.build();

    const document = SwaggerModule.createDocument(this.nestApplication, config);
    SwaggerModule.setup('api-docs', this.nestApplication, document);
  }
}
