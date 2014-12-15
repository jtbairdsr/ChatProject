/*
 * @Author: jonathan
 * @Date:   2014-12-05 14:09:33
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-15 11:33:41
 */

angular.module('chatApp')
    .controller('UsersCtrl', ['$scope', '$state', '$firebase', '$firebaseAuth', 'currentAuth', '$alert',
        function($scope, $state, $firebase, $firebaseAuth, currentAuth, $alert) {
            var usersRef = $scope.ref.child('users');
            var usersArray = $firebase(usersRef).$asArray();
            $scope.users = usersArray;
            $scope.$emit('getUser');
            $scope.newUser = {
                admin: false,
                disabled: false
            };
            var auth = $firebaseAuth($scope.ref);
            $scope.updateUser = function(user) {
                user.edit = false;
                $scope.users.$save(user)
                    .then(function(ref) {
                        var nameChangeSuccess = $alert({
                            title: 'Success',
                            content: user.$id + ' has been updated',
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
            };
            $scope.addUser = function() {
                var temp = $scope.newUser.fName + ' ' + $scope.newUser.lName;
                auth.$createUser($scope.newUser.uName, $scope.newUser.password)
                    .then(function(user) {
                        $alert({
                            title: 'Success',
                            content: temp + ' is now an authorized user of the system.',
                            placement: 'top-right',
                            duration: '3',
                            type: 'success',
                            show: true
                        });
                        console.log('create user success');
                    }, function(error) {
                        var nameChangeError = $alert({
                            title: 'Error:',
                            content: error.toString().split(':')[1],
                            placement: 'top-right',
                            duration: '3',
                            type: 'danger',
                            show: true
                        });
                        console.log('create user failed' + error);
                    });
                $firebase(usersRef).$set($scope.newUser.uName.split('@')[0], {
                    fName: $scope.newUser.fName,
                    lName: $scope.newUser.lName,
                    admin: $scope.newUser.admin,
                    edit: false
                });
                $scope.newUser = {};
            };
        }
    ])
