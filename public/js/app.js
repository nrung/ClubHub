var app = angular.module('clubhub', []);

app.controller('MainCtrl', [
'$scope',
function($scope){
  $scope.test = 'Hello world!';
}]);

app.directive("login", function(){
    return {
        restrict: "E",
        templateUrl: "assets/html/login.html"
    }
});

app.directive("signup", function(){
    return {
        restrict: "E",
        templateUrl: "assets/html/signup.html"
    }
});

