import { MicroserviceConfigurator } from '@XBounty/common/setup/microservice.configurator';
import { AppModule } from './app.module';
import configFactory from './config';

async function bootstrap() {
  const microserviceConfigurator = new MicroserviceConfigurator();
  await microserviceConfigurator.create(AppModule);
  microserviceConfigurator.setup();
  microserviceConfigurator.enableTrustProxy();
  microserviceConfigurator.listen(configFactory().port);
}
bootstrap();
