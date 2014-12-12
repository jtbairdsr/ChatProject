'use strict';

/**
 * @ngdoc function
 * @name documentsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the documentsApp
 */
angular.module('chatApp')
    .controller('AdminCtrl', ['$scope', '$state', '$firebase', 'Auth',
        function($scope, $state, $firebase, Auth) {
            var messgeRef = $scope.ref.child('messages');
            var sync = $firebase(messgeRef);
            $scope.messages = sync.$asArray();
            $scope.user = Auth.$getAuth();
            if(!$scope.user.details.admin) {
            	$state.go('chat');
            }
            $scope.userAdmin = function() {
                $state.go('users');
            }
        }
    ]);
