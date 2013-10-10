var Lunchy = Lunchy || {};
Lunchy.session = angular.module('session', ['security']);

Lunchy.session.controller('LoginCtrl', function($scope, $location, authService) {

  $scope.user = {};

  $scope.signIn = function() {
    function success() {
      $location.url('/home');
    }
    function error() {
      $scope.user.password = '';
      $scope.notice = 'Cannot authenticate';
    }
    authService.login($scope.user).then(success, error);
  };

});

Lunchy.session.controller('LogoutCtrl', function($scope, $location, authService) {

  $scope.logout = function() {
    authService.logout().then(function() {
      $location.url('/login');
    });
  };

});

