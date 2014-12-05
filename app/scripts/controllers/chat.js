/*
* @Author: jonathan
* @Date:   2014-12-04 13:14:41
* @Last Modified by:   jonathan
* @Last Modified time: 2014-12-05 02:31:56
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
    .controller('ChatCtrl', ['$scope', '$firebase', 'Auth',
        function($scope, $firebase, Auth) {
            var ctrl = this;
            var ref = new Firebase('https://luminous-inferno-5021.firebaseIO.com/messages');
            var sync = $firebase(ref);
            $scope.messages = sync.$asArray();
            ctrl.addMessage = function(user) {
                var date = new Date();
                var tempText = $scope.newMessageText;
                var text = '';
                var lineBreaks = tempText.split('\n');
                for (var i = 0; i < lineBreaks.length; i++) {
                	text += lineBreaks[i] + '<br>';
                };
                if (text !== '' && text !== undefined) {
                    $scope.messages.$add({
                        date: date.toString(),
                        text: text,
                        user: user
                    });
                    $scope.newMessageText = '';
                }
            };
        }
    ]);
