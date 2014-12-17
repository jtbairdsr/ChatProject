/*
 * @Author: jonathan
 * @Date:   2014-12-10 11:00:13
 * @Last Modified by:   jonathan
 * @Last Modified time: 2014-12-17 10:43:17
 */
'use strict';

/**
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
/**
 * This sets up inportant variables and $scope watchers.
 * it will always fire on the initial run of the app.
 */
app.run(['$rootScope', '$state', 'Auth', '$firebase', '$timeout',
    function($rootScope, $state, Auth, $firebase, $timeout) {
        // a watcher to catch and unauthorized errors and redirect to the login view.
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $state.go('login');
            }
        });
        // a watcher that lets us rerun the getUser function every time a user moves to a new view.
        $rootScope.$on('getUser', function() {
            getUser();
        });
        // add a basic ref to all the server data to $rootScope so we have access to it everywhere.
        $rootScope.ref = new Firebase("https://luminous-inferno-5021.firebaseIO.com");
        // if the user is authenticated then we get the user details.
        if (Auth.$getAuth()) {
            getUser();
        }

        // start defining the getUser function.
        function getUser() {
                if ($rootScope.user === undefined) {
                    // if we don't have a user in $scope yet then get one.
                    $rootScope.ref = new Firebase("https://luminous-inferno-5021.firebaseIO.com");
                    var user = Auth.$getAuth();
                    user.details = $firebase($rootScope.ref.child('users').child(user.password.email.split('@')[0])).$asObject();
                    $rootScope.user = user;
                } else {
                    // if we have a user then set a timeout to make sure all the details are back and check if the user is disabled.
                    $timeout(function() {
                        if ($rootScope.user.details.disabled) {
                            // if the user is disabled unauthorize the user and send them to the login view.
                            $state.go('login');
                            Auth.$unauth();
                        }
                    }, 1000);
                }
            } // end getUser function.
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
                'currentAuth': ['Auth',
                    function(Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }
                ]
            }
        })
        .state('admin', {
            url: '/admin',
            templateUrl: 'views/admin.html',
            controller: 'AdminCtrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                'currentAuth': ['Auth',
                    function(Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }
                ],
                // 'user': ['Auth',
                //     function(Auth) {
                //         return Auth.getAuth();
                //     }
                // ]
            }
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                'currentAuth': ['Auth',
                    function(Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }
                ],
                // 'user': ['Auth',
                //     function(Auth) {
                //         return Auth.getAuth();
                //     }
                // ]
            }
        })
        .state('users', {
            url: '/users',
            templateUrl: 'views/users.html',
            controller: 'UsersCtrl',
            resolve: {
                // controller will not be loaded until $waitForAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                'currentAuth': ['Auth',
                    function(Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }
                ],
                // 'user': ['Auth',
                //     function(Auth) {
                //         return Auth.getAuth();
                //     }
                // ]
            }
        });
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

// a filter that will only show messages from the last 24 hours.
app.filter('today', function() {
    return function(items) {
        var filteredItems = [];
        angular.forEach(items, function(item) {
            if (Date.compare(Date.parse(item.date), Date.today().addHours(-24)) === 1) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    }
});

// this filter takes the queries from admin messages and uses them to sort the data.
app.filter('adminMessages', function() {
    return function(items, dateSearch, textSearch, userSearch) {
        var filteredItems = [];
        var flag = true;
        angular.forEach(items, function(item) {
            if (dateSearch) {
                flag = false;
                if (textSearch) {
                    if (userSearch) {
                        if ((item.date.indexOf(dateSearch) > -1) &&
                            (item.text.indexOf(textSearch) > -1) &&
                            (item.user.indexOf(userSearch) > -1)) {
                            filteredItems.push(item);
                        }
                    } else {
                        if (item.date.indexOf(dateSearch) > -1 &&
                            item.text.indexOf(textSearch) > -1) {
                            filteredItems.push(item);
                        }
                    }
                } else if (userSearch) {
                    if (item.date.indexOf(dateSearch) > -1 &&
                        item.user.indexOf(userSearch) > -1) {
                        filteredItems.push(item);
                    }
                } else {
                    if (item.date.indexOf(dateSearch) > -1) {
                        filteredItems.push(item);
                    }
                }
            } else if (textSearch) {
                flag = false;
                if (userSearch) {
                    if (item.text.indexOf(textSearch) > -1 &&
                        item.user.indexOf(userSearch) > -1) {
                        filteredItems.push(item);
                    }
                } else {
                    if (item.text.indexOf(textSearch) > -1) {
                        filteredItems.push(item);
                    }
                }
            } else if (userSearch) {
                flag = false;
                if (item.user.indexOf(userSearch) > -1) {
                    filteredItems.push(item);
                }
            }
        });
        if (flag) {
            filteredItems = items;
        }
        return filteredItems;
    }
})
