var Lunchy = Lunchy || {};
Lunchy.main = angular.module('lunchy', ['session', 'common']);

Lunchy.main.config(function($routeProvider, $httpProvider) {

  $routeProvider
    .when('/home', {
      templateUrl: 'templates/home.html',
      resolve: {
        currentUser: Lunchy.security.currentUser
      }
    })
    .when('/login', {
      templateUrl: 'templates/login.html'
    })
    .otherwise({
      redirectTo: '/home'
    });

});

Lunchy.main.run(function($rootScope, $location, lunchyEvents) {
  $rootScope.$on(lunchyEvents.loginRequired, function() {
    $location.url('/login');
  });
});