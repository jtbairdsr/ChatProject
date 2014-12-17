/*
 * @Author: jonathan
 * @Date:   2014-12-04 13:14:41
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-17 10:07:20
 */
'use strict';

/**
 * # ChatCtrl
 * Controller for the chat functionality of the app.
 * This controller handles creating of new messages and binding them to the DOM
 */
angular.module('chatApp')
    .controller('ChatCtrl', ['$scope', '$firebase', 'currentAuth', 'Auth',
        function($scope, $firebase, currentAuth, Auth) {
            // initialize the newMessageText object.
            $scope.newMessageText = '';
            // This creates a pointer at the messages data on the server.
            var messgeRef = $scope.ref.child('messages');
            // This creates an array of messages objects that are in sync with
            // the data on the server.  The array of messages is then assigned
            // to $scope so that we have access to it in the DOM.
            $scope.messages = $firebase(messgeRef).$asArray();
            // Here we access the Auth factory built in the app.js file and use
            // the data that we retrieve to tag any new messages created with
            // the appropriate user.
            $scope.$emit('getUser');
            // This is the submit button.
            $scope.addMessage = function() {
                // this is a check to make sure there is data in the message
                // text before we start trying to manipulate that data.
                if ($scope.newMessageText !== undefined) {
                    // First we have to alter the text of the message so that
                    // we can perserve any line breaks and display the message
                    // as a multiline message.
                    var tempText = $scope.newMessageText;
                    var text = '';
                    // this will split the string into an array of lines.
                    var lineBreaks = tempText.split('\n');
                    // now we will concatinate the strings back together with
                    // '<br>' tags between them so that the will be displayed as
                    //  new lines in the messages view.
                    for (var i = 0; i < lineBreaks.length; i++) {
                        text += lineBreaks[i] + '<br>';
                    };
                    // now we simply add the message to the array of messages
                    // by using the method that pushes that data to the server.
                    $scope.messages.$add({
                        date: new Date().toString(),
                        text: text,
                        user: $scope.user.details.fName
                    });
                    // this resets the newMessageText variable for the next
                    // message.
                    $scope.newMessageText = undefined;
                }
            };
        }
    ]);
