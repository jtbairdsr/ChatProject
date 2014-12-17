/*
* @Author: jonathan
* @Date:   2014-12-10 11:00:13
* @Last Modified by:   jonathan
* @Last Modified time: 2014-12-17 10:21:51
*/
'use strict';

/**
 * # AdminCtrl
 * Controller for the query functionality of the app.
 * This controller handles all of the querieng of historic data.
 */
angular.module('chatApp')
    .controller('AdminCtrl', ['$scope', '$state', '$firebase', 'Auth',
        function($scope, $state, $firebase, Auth) {
            // Here we access the Auth factory built in the app.js file and use
            // the data that we retrieve to determine wheher or not the current
            // user should have access to this view.
            $scope.$emit('getUser');
            // This creates a pointer at the messages data on the server.
            var messgeRef = $scope.ref.child('messages');
            // This creates an array of messages objects that are in sync with
            // the data on the server.  The array of messages is then assigned
            // to $scope so that we have access to it in the DOM.
            $scope.messages = $firebase(messgeRef).$asArray();
            if(!$scope.user.details.admin) {
                // if the current user isn't an admin then redirect them to the
                // chat view.
            	$state.go('chat');
            }
            // this is the button that will open the userAdmin view.
            $scope.userAdmin = function() {
                $state.go('users');
            }
        }
    ]);
