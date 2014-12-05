/*
 * @Author: jonathan
 * @Date:   2014-12-05 02:14:17
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-05 03:40:23
 */

angular.module('chatApp')
    .controller('LoginCtrl', ['$scope', 'currentAuth', 'Auth', '$state',
        function($scope, currentAuth, Auth, $state) {
            var ctrl = this;
            var ref = new Firebase("https://luminous-inferno-5021.firebaseIO.com");
            $scope.login = function() {
                Auth.$authWithPassword({
                    email: $scope.email,
                    password: $scope.password
                }, {
                    remember: 'sessionOnly'
                }).then(function(authData) {
                    console.log(JSON.stringify(authData, null, '\t'));
                    $state.go('chat');
                }).catch(function(error) {
                    console.log('Error authenticating user:', error);
                });
            }
        }
    ])
