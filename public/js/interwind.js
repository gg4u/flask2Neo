'use strict';

var interwindLearning = angular.module('InterwindLearning', [
  'ngRoute',
  'ngDialog'
])

// interwindLearning.config(function ($routeProvider) {
//   	$routeProvider.when('/', {
// 	  	templateUrl: 'views/private/companies',
// 	  	controller: 'companiesController'
// 	}).
// 	when('/company/:identifier', {
// 	  	templateUrl: 'views/private/users',
// 	  	controller: 'usersController'
// 	}).
// 	when('/company/:identifier/edit', {
// 	  	templateUrl: 'views/private/edit-companies',
// 	  	controller: 'editCompanyController'
// 	}).
// 	otherwise({
// 	  	redirectTo: '/'
// 	});
// });

interwindLearning.controller('nodeController', function($scope, $http, $location, $filter, $route, $routeParams, $rootScope ,$templateCache, $compile, ngDialog) {

	$scope.showDescription = function() {
		
		// $scope.invite = {}
		// $scope.send_notification = false

		// $scope.send_notification_change = function() {
		// 	$scope.send_notification ^= true
		// }

		var confirmation = ngDialog.openConfirm({
			template: $templateCache.get('show_description.html'),
			plain:true,
			className: 'ngdialog-theme-plain',
			scope: $scope,
			cache: false
		}).then(function () {
			//Use $scope.invite

			// if (!$scope.invite.email || $scope.invite.email == "") 
			// 	alert("ERROR");

			// UsersManager.invite($scope.invite.email,$routeParams.identifier,CompanyManager.company_data.name,$scope.send_notification,function(result) {
			// 	delete $scope.invite
			// 	delete $scope.send_notification
			// })

		}, function (reason) {
			//User dismiss alert with negative result
			// delete $scope.invite
			// delete $scope.send_notification
		})
		
	    return false;
	}
})