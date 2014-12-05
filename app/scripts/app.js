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
        'ui.router',
        'mgcrea.ngStrap'

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
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                'currentAuth': ['Auth', function(Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                }]
            }
        })
        .state('chat', {
            url: '/chat',
            templateUrl: 'views/chat.html',
            controller: 'ChatCtrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                'currentAuth': ['Auth', function(Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
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
                'currentAuth': ['Auth', function(Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
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
                'currentAuth': ['Auth', function(Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
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
                'currentAuth': ['Auth', function(Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
                }]
            }
        })
});
// Authentication Factory so we don't have to do this everytime we want to check authentication.
app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase("https://luminous-inferno-5021.firebaseIO.com");
        return $firebaseAuth(ref);
    }
]);
// Controller that lets me have access to methods in the header.
app.controller('NavCtrl', ['$scope', 'Auth',
    function($scope, Auth) {
        var ctrl = this;
        ctrl.logout = function() {
            Auth.$unauth();
        };
    }
]);
