var Lunchy = Lunchy || {};
Lunchy.security = angular.module('security', ['common']);

Lunchy.security.currentUser = function($q, $rootScope, authService) {
  return authService.requestCurrentUser();
};


Lunchy.security.service('authService', function($q, $http, $rootScope, lunchyEvents) {

  this.requestCurrentUser = function() {
    if($rootScope.currentUser) {
      return $q.when($rootScope.currentUser);
    }
    return $http.get('/api/session').then(function(response) {
      $rootScope.currentUser = response.data;
      return $rootScope.currentUser;
    }, function() {
      $rootScope.$broadcast(lunchyEvents.loginRequired);
    });
  };

  this.login = function(user) {
    return $http.post('/api/session', user).then(function(response) {
      $rootScope.currentUser = response.data;
    });
  };

  this.logout = function() {
    return $http.delete('/api/session').then(function() {
      delete $rootScope.currentUser;
    });
  };

});