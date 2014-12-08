/*
 * @Author: jonathan
 * @Date:   2014-12-05 14:09:33
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-08 14:54:39
 */

angular.module('chatApp')
    .controller('UsersCtrl', ['$scope', '$state', '$firebase', 'currentAuth',
        function($scope, $state, $firebase, currentAuth) {
            var ref = new Firebase('https://luminous-inferno-5021.firebaseIO.com/users');
            var sync = $firebase(ref);
            var usersArray = sync.$asArray();
            $scope.users = usersArray;
            $scope.newUser = {};
            $scope.addUser = function() {
            	usersArray.$add({
            		uName: $scope.newUser.uName,
            		fName: $scope.newUser.fName,
            		lName: $scope.newUser.lName,
            		password: $scope.newUser.password,
            		admin: $scope.newUser.admin,
            		edit: false
            	})
            	$scope.newUser={};
            };
        }
    ])
