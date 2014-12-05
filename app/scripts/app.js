'use strict';

/**
 * @ngdoc overview
 * @name documentsApp
 * @description
 * # documentsApp
 *
 * Main module of the application.
 */
angular
  .module('chatApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'

  ])
  .config(function ($stateProvider, $urlRouterProvider) {

    // For an unmatched url, redirect to /chat
    $urlRouterProvider.otherwise("/chat");

    // Now se up the states
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
  });
