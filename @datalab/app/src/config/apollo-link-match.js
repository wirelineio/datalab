import { ApolloLink } from 'apollo-link';
import { isTerminating } from 'apollo-link/lib/linkUtils';
import Observable from 'zen-observable';

// links = [ { type: 'gmail', link: somehttplink } ]

export class MatchLink extends ApolloLink {
  constructor({ rootLinks = [], userLinks = [], fallback = null }) {
    super();
    this.rootLinks = rootLinks;
    this.userLinks = userLinks;
    this.fallback = fallback;
  }

  updateUserLinks(userLinks = []) {
    this.userLinks = userLinks;
  }

  request(operation, forward) {
    let link;

    const context = operation.getContext() || {};

    if (!context.serviceType) {
      return this.fallback.request(operation) || Observable.of();
    }

    let service = this.rootLinks.find(service => service.type === context.serviceType);

    if (!service) {
      service = this.userLinks.find(service => service.type === context.serviceType);
    }

    if (!service) {
      return this.fallback.request(operation) || Observable.of();
    } else {
      link = service.link;
    }

    if (isTerminating(link)) {
      return link.request(operation) || Observable.of();
    }

    return link.request(operation, forward) || Observable.of();
  }
}
