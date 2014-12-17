/*
 * @Author: jonathan
 * @Date:   2014-12-05 02:14:17
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-17 09:56:15
 */
'use strict';

/**
 * # LoginCtrl
 * Controller for the login functionality of the app.
 * This controller handles loging the user into the app.
 */
angular.module('chatApp')
    .controller('LoginCtrl', ['$rootScope', '$scope', 'currentAuth', 'Auth', '$state', '$firebase', '$alert', '$timeout',
        function($rootScope, $scope, currentAuth, Auth, $state, $firebase, $alert, $timeout) {
            // This creates a pointer at the data on the server.
            var ref = new Firebase("https://luminous-inferno-5021.firebaseIO.com");
            // This is the login button.
            $scope.login = function() {
                // First we try to authenticate the user with the server.
                Auth.$authWithPassword({
                    email: $scope.email,
                    password: $scope.password
                }, {
                    // this sets the duration of the login to last until the user closes their browser.
                    remember: 'sessionOnly'
                }).then(function(authData) {
                    // Since we succeded in authenticating we are now going to check to see if the authenticated user is still active.
                    // first we have to find the user object associated with the authenticated user.
                    authData.details = $firebase($rootScope.ref.child('users')
                        .child(authData.password.email.split('@')[0])).$asObject();
                    // now we set a timeout to make sure the asyncronous call returns before we proceed.
                    $timeout(function() {
                        // check to see if the user is disabled.
                        if (authData.details.disabled) {
                            // if the user has been disabled, pop and alert to explain why the weren't lobed in and unauthenticate the user.
                            $alert({
                                title: 'Error:',
                                content: 'Your account has been disabled.  If this is an error please contact your team lead.',
                                placement: 'middle',
                                duration: '3',
                                type: 'danger',
                                show: true
                            });
                            Auth.$unauth();
                        } else {
                            // if the user hasn't been disabled assign there user data to $scope for access through out the DOM and send them to the chat view.
                            $rootScope.user = authData;
                            $state.go('chat');
                        }
                    }, 1000);
                }).catch(function(error) {
                    // if there is an error pop and alert to explain to the user.
                    $alert({
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
