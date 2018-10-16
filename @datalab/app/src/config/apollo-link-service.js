import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import Observable from 'zen-observable';
import { toPromise } from 'apollo-link/lib/linkUtils';
import merge from 'deepmerge';

// links = [ { type: 'gmail', link: somehttplink } ]

export class ServiceLink extends ApolloLink {
  constructor({ rootLinks = [], fallback = null }) {
    super();
    this.rootLinks = rootLinks;
    this.userLinks = [];
    this.fallback = fallback;
  }

  updateServices(services = []) {
    this.userLinks = services.filter(s => s.enabled && s.url).map(s => {
      return { type: s.type, link: new HttpLink({ uri: s.url }) };
    });
  }

  request(operation, forward) {
    const context = operation.getContext() || {};

    if (!context.serviceType) {
      return this.fallback.request(operation) || Observable.of();
    }

    // services to concat data
    let services = [
      ...this.rootLinks.filter(service => service.type === context.serviceType),
      ...this.userLinks.filter(service => service.type === context.serviceType)
    ];

    if (services.length === 0) {
      return this.fallback.request(operation) || Observable.of();
    }

    return new Observable(async observer => {
      const result = await Promise.all(
        services.map(async ({ link }) => {
          try {
            return toPromise(link.request(operation));
          } catch (err) {
            return {};
          }
        })
      );

      observer.next(merge.all(result));
      observer.complete();
    });
  }
}

export const extendClient = (client, serviceLink) => {
  client.updateServices = (...args) => {
    serviceLink.updateServices(...args);
  };
};
