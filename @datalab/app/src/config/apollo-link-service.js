import { ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
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
      return { id: s.id, type: s.type, link: new HttpLink({ uri: `${s.url}/gql` }) };
    });
  }

  request(operation) {
    const { operation: operationType } = getMainDefinition(operation.query);
    const context = operation.getContext() || {};

    if (!context.serviceType) {
      return this.fallback.request(operation) || Observable.of();
    }

    switch (operationType) {
      case 'query':
        return this.runQuery(context, operation);
      case 'mutation':
        return this.runMutation(context, operation);
      default:
        return Observable.of();
    }
  }

  runQuery(context, operation) {
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

  runMutation(context, operation) {
    const { serviceType, serviceId } = context;

    let service = this.rootLinks.find(service => service.type === serviceType && service.id === serviceId);
    if (!service) {
      service = this.userLinks.find(service => service.type === serviceType && service.id === serviceId);
    }

    if (!service) {
      return this.fallback.request(operation) || Observable.of();
    }

    const { link } = service;

    return link.request(operation);
  }
}

export const extendClient = (client, serviceLink) => {
  client.updateServices = (...args) => {
    serviceLink.updateServices(...args);
  };
};
