import { ServiceHelper } from '@wirelineio/sdk';

export const IDM = {
  resourceId: ServiceHelper.mayEnv('WRL_IDM_RESOURCE_ID', 'datalab'),

  attestUrl: ServiceHelper.mayEnv('WRL_IDM_URL', ServiceHelper.mayEnv('WRL_URL_ENDPOINT')),

  realm: ServiceHelper.mayEnv('WRL_IDM_URL', ServiceHelper.mayEnv('WRL_URL_ENDPOINT'))
};

export const CLAIMS = {
  IS_USER: 'datalab-user',
  IS_ADMIN: 'datalab-admin'
};
