/*
 * @Author: jonathan
 * @Date:   2014-12-05 02:14:17
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-12 14:19:09
 */

angular.module('chatApp')
    .controller('LoginCtrl', ['$rootScope', '$scope', 'currentAuth', 'Auth', '$state', '$firebase', '$alert', '$timeout',
        function($rootScope, $scope, currentAuth, Auth, $state, $firebase, $alert, $timeout) {
            var ref = new Firebase("https://luminous-inferno-5021.firebaseIO.com");
            $scope.login = function() {
                Auth.$authWithPassword({
                    email: $scope.email,
                    password: $scope.password
                }, {
                    remember: 'sessionOnly'
                }).then(function(authData) {
                    var temp = 0;
                    authData.details = $firebase($rootScope.ref.child('users').child(authData.password.email.split('@')[0])).$asObject();
                    $rootScope.user = authData;
                    console.log('user is authenticated' + ' | ' + authData);
                    // while (authData.details.disabled === undefined) {
                    //     temp++;
                    //     console.log(temp + ': ' + authData.details.disabled);
                    // }
                    $timeout(function() {
                        if (authData.details.disabled) {
                            $alert({
                                title: 'Error:',
                                content: 'Your account has been disabled.  If this is an error please contact your team lead.',
                                placement: 'top-right',
                                duration: '3',
                                type: 'danger',
                                show: true
                            });
                            Auth.$unauth();
                        } else {
                            $state.go('chat');
                        }
                    }, 1000);
                }).catch(function(error) {
                    var nameChangeError = $alert({
                        title: 'Error:',
                        content: error.toString().split(':')[1],
                        placement: 'top-right',
                        duration: '3',
                        type: 'danger',
                        show: true
                    });
                });
            }
        }
    ])
