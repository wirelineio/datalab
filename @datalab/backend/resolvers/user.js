import { IDM, CLAIMS } from '../config';

export const query = {
  async getCurrentUser(obj, args, { claimHelper, context }) {
    console.log('---------');
    console.log(JSON.stringify(context.wireline.identity));
    console.log('---------');

    claimHelper.testFor(CLAIMS.IS_USER, CLAIMS.IS_ADMIN, context);

    const userId = context.wireline.identity.accountId;

    const claims = Object.values(CLAIMS)
      .map(claim => ({ ...context.wireline.identity.getClaim(claim, IDM.resourceId) }))
      .filter(result => result.value)
      .map(result => ({ ...result, resource: IDM.resourceId }));

    // TODO(elmasse): check for user in store.
    return {
      userId,
      claims
    };
  }
};
