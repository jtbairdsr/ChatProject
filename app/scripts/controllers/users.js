/*
 * @Author: jonathan
 * @Date:   2014-12-05 14:09:33
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-17 10:28:48
 */
'use strict';

/**
 * # ProfileCtrl
 * Controller for the profile update functionality pf the app.
 * This controller handles updating personal information about the currently authenticated user.
 */
angular.module('chatApp')
    .controller('UsersCtrl', ['$scope', '$state', '$firebase', '$firebaseAuth', 'currentAuth', '$alert',
        function($scope, $state, $firebase, $firebaseAuth, currentAuth, $alert) {
            // Here we access the Auth factory built in the app.js file and use
            // the data that we retrieve to determine wheher or not the current
            // user should have access to this view.
            $scope.$emit('getUser');
            // This creates a pointer at the users data on the server.
            var usersRef = $scope.ref.child('users');
            // This creates an array of user objects that are in sync with
            // the data on the server.  The array of users is then assigned
            // to $scope so that we have access to it in the DOM.
            $scope.users = $firebase(usersRef).$asArray();
            // this is the initialization of the newUser object.
            $scope.newUser = {
                admin: false,
                disabled: false,
                edit: false
            };
            var auth = $firebaseAuth($scope.ref);
            // this is the check button.
            $scope.updateUser = function(user) {
                // set the user edit back to false.
                user.edit = false;
                // save the details to the user object on the server.
                $scope.users.$save(user)
                    .then(function(ref) {
                        // if it works we alert the user.
                        $alert({
                            title: 'Success',
                            content: user.$id + ' has been updated',
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
            };
            // this is the plus button.
            $scope.addUser = function() {
                // store the new user's full name for use in alerts.
                var temp = $scope.newUser.fName + ' ' + $scope.newUser.lName;
                // create a new user.
                auth.$createUser($scope.newUser.uName, $scope.newUser.password)
                    .then(function(user) {
                        // if it works we alert the user.
                        $alert({
                            title: 'Success',
                            content: temp + ' is now an authorized user of the system.',
                            placement: 'top-right',
                            duration: '3',
                            type: 'success',
                            show: true
                        });
                    }, function(error) {
                        // if there is an error we alert the user.
                        $alert({
                            title: 'Error:',
                            content: error.toString().split(':')[1],
                            placement: 'top-right',
                            duration: '3',
                            type: 'danger',
                            show: true
                        });
                        console.log('create user failed' + error);
                    });
                // Add details about the user to the array of users on the server.  The name of the object will match username of the new user.
                $firebase(usersRef).$set($scope.newUser.uName.split('@')[0], {
                    fName: $scope.newUser.fName,
                    lName: $scope.newUser.lName,
                    admin: $scope.newUser.admin,
                });
                // clean the newUser Variable for further use.
                $scope.newUser = {};
            };
        }
    ])
