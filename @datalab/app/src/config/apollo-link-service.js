import { ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { HttpLink } from 'apollo-link-http';
import Observable from 'zen-observable';
import { toPromise } from 'apollo-link/lib/linkUtils';
import merge from 'deepmerge';

export class ServiceLink extends ApolloLink {
  constructor({ links = [], fallback = null }) {
    super();
    this.links = links;
    this.fallback = fallback;
  }

  updateServices(services = []) {
    this.links = services
      .filter(s => s.enabled && s.url)
      .map(s => {
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
    const { serviceType } = context;

    if (!serviceType) {
      return this.fallback.request(operation) || Observable.of();
    }

    let services = this.links.filter(service => service.type === serviceType);

    if (services.length === 0) {
      throw new Error(`Link service not found for the type: ${serviceType}`);
    }

    return new Observable(async observer => {
      const result = await Promise.all(
        services.map(async ({ id, type, link }) => {
          try {
            const { data } = await toPromise(link.request(operation));
            Object.keys(data).forEach(field => {
              const value = data[field];
              if (Array.isArray(value)) {
                data[field] = value.map(row => ({ ...row, __serviceId: id, __serviceType: type }));
              } else if (typeof value === 'object') {
                data[field] = {
                  ...value,
                  __serviceId: id,
                  __serviceType: type
                };
              }
            });
            return { data };
          } catch (err) {
            return {};
          }
        })
      );
console.log(merge.all(result));
      observer.next(merge.all(result));
      observer.complete();
    });
  }

  runMutation(context, operation) {
    const { serviceType, serviceId } = context;

    if (!serviceType) {
      return this.fallback.request(operation) || Observable.of();
    }

    const service = this.links.find(
      service => service.type === serviceType && (!serviceId || service.id === serviceId)
    );

    if (!service) {
      throw new Error(`Link service ${serviceId ? '"' + serviceId + '" ' : ''}not found for the type: ${serviceType}`);
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
