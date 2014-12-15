/*
* @Author: jonathan
* @Date:   2014-12-04 13:14:41
* @Last Modified by:   jonathan
* @Last Modified time: 2014-12-15 11:50:22
*/
'use strict';

/**
 * @ngdoc function
 * @name documentsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the documentsApp
 */
angular.module('chatApp')
    .controller('ChatCtrl', ['$scope', '$firebase', 'currentAuth', 'Auth',
        function($scope, $firebase, currentAuth, Auth) {
            var messgeRef = $scope.ref.child('messages');
            var sync = $firebase(messgeRef);
            $scope.messages = sync.$asArray();
            $scope.$emit('getUser');
            $scope.addMessage = function() {
                var date = new Date();
                var tempText = $scope.newMessageText;
                var text = '';
                var lineBreaks = tempText.split('\n');
                for (var i = 0; i < lineBreaks.length; i++) {
                	text += lineBreaks[i] + '<br>';
                };
                if (text !== undefined) {
                    $scope.messages.$add({
                        date: date.toString(),
                        text: text,
                        user: $scope.user.details.fName
                    });
                    $scope.newMessageText = undefined;
                }
            };
        }
    ]);
