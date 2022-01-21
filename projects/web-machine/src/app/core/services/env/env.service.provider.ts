import { EnvService } from './env.service';

export const EnvServiceFactory = () => {  
    const env = new EnvService();
  
    // Read environment variables from browser window
    const browserWindow = window || {};
    const browserWindowEnv = browserWindow['__env'] || {};
  
    // Assign environment variables from browser window to env
    for (const key in browserWindowEnv) {
      if (browserWindowEnv.hasOwnProperty(key)) {
        env[key] = window['__env'][key];
      }
    }
  
    return env;
  };
  
  export const EnvProvider = {  
    provide: EnvService,
    useFactory: EnvServiceFactory,
    deps: [],
  };