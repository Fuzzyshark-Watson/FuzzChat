import store from '../store';

export function authGuard(to, from, next) {
  console.log('Navigation guard:', { to, from }); // Debugging log
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      console.log('Not authenticated, redirecting to /'); // Debugging log
      next('/'); // Redirect to the start screen if not authenticated
    } else {
      console.log('Authenticated, proceeding to route'); // Debugging log
      next(); // Proceed to the route
    }
  } else {
    next(); // Proceed to the route
  }
}