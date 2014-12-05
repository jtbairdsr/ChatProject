'use strict';

/**
 * @ngdoc function
 * @name documentsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the documentsApp
 */
angular.module('chatApp')
    .controller('AdminCtrl', ['$scope', '$state',
        function($scope, $state) {
            $scope.userAdmin = function() {
            	$state.go('users');
            }
        }
    ]);
