/*
 * @Author: jonathan
 * @Date:   2014-12-05 14:09:33
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-17 10:19:32
 */
'use strict';

/**
 * # ProfileCtrl
 * Controller for the profile update functionality pf the app.
 * This controller handles updating personal information about the currently authenticated user.
 */
angular.module('chatApp')
    .controller('ProfileCtrl', ['$scope', 'Auth', 'currentAuth', '$alert',
        function($scope, Auth, currentAuth, $alert) {
            $scope.$emit('getUser');
            // this is the Log Out button.
            $scope.logOff = function() {
                // unauthenticate the user.
                Auth.$unauth();
                // send the user to the login view.
                $state.go('login');
            };
            // this is the Update Name button.
            $scope.updateUser = function() {
                // save the updated user details to the server.
                $scope.user.details.$save()
                    .then(function(ref) {
                        // if it works we alert the user.
                        alert({
                            title: 'Success',
                            content: 'Your name has been updated',
                            placement: 'top-right',
                            duration: '3',
                            type: 'success',
                            show: true
                        });
                    })
                    .catch(function(error) {
                        // if there is an error we alert the user.
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
    ]);
/**
 * # PasswordCtrl
 * Controller for the password change functionality of the app.
 * This controller handles changing a users password.
 */
angular.module('chatApp')
    .controller('PasswordCtrl', ['$scope', 'Auth', '$alert',
        function($scope, Auth, $alert) {
            // this is the Yes button on the change password modal.
            $scope.changePassword = function() {
                if ($scope.newPassword === $scope.newPasswordRetype) {
                    // if the new password and the retype of the new password match we fire the changePassword method..
                    Auth.$changePassword($scope.user.password.email, $scope.oldPassword, $scope.newPassword)
                        .then(function() {
                            // if it works we alert the user.
                            $alert({
                                title: 'Success',
                                content: 'Your password has been updated',
                                placement: 'top-right',
                                duration: '3',
                                type: 'success',
                                show: true
                            });
                        }).catch(function(error) {
                            // if there is an error we alert the user.
                            var passChangeError = $alert({
                                title: 'Error:',
                                content: error.toString().split(':')[1],
                                placement: 'top-right',
                                duration: '3',
                                type: 'danger',
                                show: true
                            });
                        });
                } else {
                    // if the new password and the retype of the new password don't match we alert the user.
                    $alert({
                        title: 'Error',
                        content: 'The passwords must match!',
                        placement: 'top',
                        duration: '3',
                        type: 'danger',
                        show: true
                    });
                }
            };
        }
    ])
