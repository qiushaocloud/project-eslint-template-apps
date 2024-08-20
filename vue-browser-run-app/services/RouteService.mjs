import Router from '@router'

class RouteService {
  constructor() {
    if (RouteService.instance) return RouteService.instance;
    RouteService.instance = this;
  }

  getCurrentRoute() {
    return Router.currentRoute.value;
  }

  getCurrentRoutePath() {
    return this.getCurrentRoute().path;
  }

  navigateToLoginOrRegister(path) {
    if (!/\/(login|register)$/.test(path)) return;
    const currentRoute = this.getCurrentRoute();
    let redirectInfo = currentRoute.query.redirect_info;
    if (!redirectInfo && !/\/(login|register)$/.test(currentRoute.path)) {
      redirectInfo = btoa(JSON.stringify({path: currentRoute.path, query: currentRoute.query}));
    }
    this.navigateTo(path, redirectInfo ? { redirect_info: redirectInfo } : undefined);
  }

  navigateToRedirect() {
    const currentRoute = this.getCurrentRoute();
    const redirectInfo = currentRoute.query.redirect_info ? JSON.parse(atob(currentRoute.query.redirect_info)) : undefined;
    if (redirectInfo) return this.navigateTo(redirectInfo.path, redirectInfo.query);
    this.navigateTo('/');
  }

  navigateTo(path, query) {
    console.log('navigating to', path, query);
    const toRoute = { path: path };
    query && (toRoute.query = query);
    Router.push(toRoute);
  }
}

export default new RouteService();