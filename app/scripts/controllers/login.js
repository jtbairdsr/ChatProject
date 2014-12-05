/*
 * @Author: jonathan
 * @Date:   2014-12-05 02:14:17
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-05 02:15:04
 */

angular.module('chatApp')
    .controller('LoginCtrl', ['$scope', 'Auth',
        function($scope, Auth) {
            var ctrl = this;
            var ref = new Firebase("https://luminous-inferno-5021.firebaseIO.com");
            $scope.auth = Auth;
            $scope.user = $scope.auth.$getAuth();
            ctrl.login = function() {
                ref.authWithPassword({
                    email: $scope.email,
                    password: $scope.password
                }, function(error, authData) {
                    if (error === null) {
                        console.log(JSON.stringify(authData, null, '\t'));
                    } else {
                        console.log('Error authenticating user:', error);
                    }
                });
            }
        }
    ])
