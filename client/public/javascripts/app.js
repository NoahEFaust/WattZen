var wattzenApp = angular.module('wattzenApp', ['ngRoute']);

wattzenApp.controller('MainCtrl', ['$scope', function($scope, $route, $location, $window){
        $scope.reloadRoute = function() {
            console.log('reload called!');
        }
        console.log($scope.message);
        this.$route = $route;
        this.$location = $location;
}]);


wattzenApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/home', {
        templateUrl: 'partials/home',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
}]);


wattzenApp.controller('LoginCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.formData = {};
        $location = {};

        // Create a new todo
        $scope.createUser = function(todoID) {
            $http.post('/api/v1/user', $scope.formData)
                .success(function(data) {
                    $scope.formData = data;
                    $location.path('partials/home');
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        };

}]);

wattzenApp.controller('HomeCtrl', ['$scope', '$http', '$location', 
    function($scope, $http, $location) {

        $scope.formData = {};
        $scope.todoData = {};
        $scope.apiEnergyValue = {};

        // Get all todos
        $http.get('/api/v1/todos')
            .success(function(data) {
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });

        // Create a new todo
        $scope.createUser = function(todoID) {
            $http.post('/api/v1/todos', $scope.formData)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.todoData = data;
                    console.log(data);
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        };

        // Delete a todo
        $scope.deleteTodo = function(todoID) {
            $http.delete('/api/v1/todos/' + todoID)
                .success(function(data) {
                    $scope.todoData = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

}]);

