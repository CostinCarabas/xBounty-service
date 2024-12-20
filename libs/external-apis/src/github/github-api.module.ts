import { DynamicModule, Module } from '@nestjs/common';
import { GithubApiModuleOptions } from './options';
import { HttpModule } from '@XBounty/http';
import { GithubApiService } from './github-api.service';
import { JwtModule } from '@nestjs/jwt';

@Module({})
export class GithubApiModule {
  static register(
    options: GithubApiModuleOptions,
  ): DynamicModule {
    return {
      module: GithubApiModule,
      imports: [
        JwtModule.register({}),
        HttpModule,
        // OctokitModule.forRootAsync({
        //   useFactory: () => {
        //     console.log('options :>> ', options);
        //     return {
        //       // isGlobal: true,
        //       octokitOptions: {
        //         authStrategy: createAppAuth,
        //         auth: {
        //           appId: options.appId,
        //           privateKey: options.apiKey,
        //         },
        //       },
        //     };
        //   },
        // }),
      ],
      providers: [
        {
          provide: GithubApiModuleOptions,
          useValue: options,
        },
        GithubApiService,
      ],
      exports: [
        GithubApiService,
      ],
    };
  }
}
