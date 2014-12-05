'use strict';

/**
 * @ngdoc overview
 * @name documentsApp
 * @description
 * # documentsApp
 *
 * Main module of the application.
 */
var app = angular
    .module('chatApp', [
        'ngAnimate',
        'firebase',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router'

    ]);
app.run(['$rootScope', '$state',
    function($rootScope, $state) {
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $state.go('login');
            }
        });
    }
]);
app.config(function($stateProvider, $urlRouterProvider) {

    // For an unmatched url, redirect to /chat
    $urlRouterProvider.otherwise("/chat");

    // Now set up the states
    $stateProvider
        .state('login', {
            // abstract: true,
            controller: 'LoginCtrl',
            templateUrl: 'views/login.html',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                }]
            }
        })
        .state('chat', {
            url: '/chat',
            templateUrl: 'views/chat.html',
            controller: 'ChatCtrl as ctrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                }]
            }
        })
        .state('admin', {
            url: '/admin',
            templateUrl: 'views/admin.html',
            controller: 'AdminCtrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                }]
            }
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                }]
            }
        })
        .state('users', {
            url: '/users',
            templateUrl: 'views/users.html',
            controller: 'UsersCtrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                }]
            }
        })
});
app.filter('htmlEscape', function() {
    return function(input) {
        if (!input) {
            return '';
        }
        return input.
        replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/'/g, '&#39;').
        replace(/"/g, '&quot;');
    };
});
app.filter('textToHtml', ['$sce', 'htmlEscapeFilter',
    function($sce, htmlEscapeFilter) {
        return function(input) {
            if (!input) {
                return '';
            }
            input = htmlEscapeFilter(input);

            var output = '';
            $.each(input.split("\n\n"), function(key, paragraph) {
                output += '<p>' + paragraph + '</p>';
            });

            return $sce.trustAsHtml(output);
        };
    }
]);
app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase("https://luminous-inferno-5021.firebaseIO.com");
        return $firebaseAuth(ref);
    }
]);
