/*
 * @Author: jonathan
 * @Date:   2014-12-05 14:09:33
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-12 11:47:32
 */

angular.module('chatApp')
    .controller('ProfileCtrl', ['$scope', 'Auth', 'currentAuth', '$alert',
        function($scope, Auth, currentAuth, $alert) {
            $scope.$emit('getUser');
            $scope.updateUser = function() {
                $scope.user.details.$save()
                    .then(function(ref) {
                        var nameChangeSuccess = $alert({
                            title: 'Success',
                            content: 'Your name has been updated',
                            placement: 'top-right',
                            duration: '3',
                            type: 'success',
                            show: true
                        });
                    })
                    .catch(function(error) {
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
    ]);
angular.module('chatApp')
    .controller('PasswordCtrl', ['$scope', 'Auth', '$alert',
        function($scope, Auth, $alert) {
            $scope.changePassword = function() {
                if ($scope.newPassword === $scope.newPasswordRetype) {
                    Auth.$changePassword($scope.user.password.email, $scope.oldPassword, $scope.newPassword)
                        .then(function() {
                            var passChangeSuccess = $alert({
                                title: 'Success',
                                content: 'Your password has been updated',
                                placement: 'top-right',
                                duration: '3',
                                type: 'success',
                                show: true
                            });
                        }).catch(function(error) {
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
                    var passChangeError = $alert({
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
