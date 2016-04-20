/* Controllers */
var wattzenControllers = angular.module('wattzenControllers', []);

wattzenControllers.controller('MainCtrl', ['$scope', '$route', '$routeParams', '$location',
    function($scope, $route, $routeParams, $location){
        this.$route = $route;
        this.$location = $location;
        this.$routeParams = $routeParams;
        $scope.message = "message";
    }]);

wattzenControllers.controller('LoginCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.formData = {};
        $location = {};

        $scope.test = {
            'breakfast':'yo mama'
        };

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

wattzenControllers.controller('HomeCtrl', ['$scope', '$http', '$location', 
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
