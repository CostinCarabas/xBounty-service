
import { GithubApiConfigurationInterface } from './github-api-configuration.interface';
import { MultiversXApisConfigurationInterface } from './multiversx-apis-configuration.interface';

export interface ApisConfigurationInterface {
  multiversx: MultiversXApisConfigurationInterface;
  github: GithubApiConfigurationInterface;
}
