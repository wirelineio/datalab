import { ServiceHelper } from '@wirelineio/sdk';

export const IDM = {
  resourceId: ServiceHelper.mayEnv('WRL_IDM_RESOURCE_ID', 'datalab'),

  attestUrl: ServiceHelper.mayEnv('WRL_IDM_URL'),

  realm: ServiceHelper.mayEnv('WRL_IDM_REALM', ServiceHelper.mayEnv('WRL_ENDPOINT_URL'))
};

export const CLAIMS = {
  IS_USER: 'datalab-user',
  IS_ADMIN: 'datalab-admin'
};
