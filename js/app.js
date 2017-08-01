// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'LocalStorageModule', 'ion-datetime-picker'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
$ionicConfigProvider.views.maxCache(0);

$stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
})
.state('app.login', {
    url: '/login',
    views: {
        'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        },

    }
})

.state('app.propertyhome', {
    url: '/propertyhome',
    params: { filter: null },
    views: {
        'menuContent': {
            templateUrl: 'templates/propertyhome.html',
            controller: 'propertyhomeCtrl'
        }
    }, resolve: {
        filterModal: function ($ionicModal, $rootScope) {
            return $ionicModal.fromTemplateUrl('templates/properties-filter.html', {
                scope: $rootScope,
                animation: 'slide-in-up'
            });
        }
    }
})

.state('app.singleproperty', {
    url: '/singleproperty',
    views: {
        'menuContent': {
            templateUrl: 'templates/singleproperty.html',
            controller: 'singlepropertyCtrl'
        }
    }
})

.state('app.filter', {
    url: '/filter',
    views: {
        'menuContent': {
            templateUrl: 'templates/filter.html',
            controller: 'FilterCtrl'
        },
    }
})


.state('app.publishproperty', {
    url: '/publishproperty',
    views: {
        'menuContent': {
            templateUrl: 'templates/publishproperty.html',
            controller: 'publishpropertyCtrl'
        },
    }
})

.state('app.favorateproperty', {
    url: '/favorateproperty',
    views: {
        'menuContent': {
            templateUrl: 'templates/favorateproperty.html',
            controller: 'favoratepropertyCtrl'
        }
    }
})

.state('app.recentviewed', {
    url: '/recentviewed',
    views: {
        'menuContent': {
            templateUrl: 'templates/recentviewed.html',
            controller: 'recentviewedCtrl'
        }
    }
})

.state('app.Admin', {
    url: '/Admin',
    views: {
        'menuContent': {
            templateUrl: 'templates/Admin.html',
            controller: 'AdminCtrl'
        }
    }
})

.state('app.MyPublished', {
    url: '/MyPublished',
    views: {
        'menuContent': {
            templateUrl: 'templates/MyPublished.html',
            controller: 'MyPublishedCtrl'
        }
    }
})

.state('app.Entrance', {
    url: '/Entrance',
    views: {
        'menuContent': {
            templateUrl: 'templates/Entrance.html',
            controller: 'EntranceCtrl'
        }
    }
})

.state('app.myRequests', {
    url: '/myRequests',
    views: {
        'menuContent': {
            templateUrl: 'templates/myRequests.html',
            controller: 'myRequestsCtrl'
        }
    }
})

.state('app.register', {
    url: '/register',
    views: {
        'menuContent': {
            templateUrl: 'templates/register.html',
            controller: 'registerCtrl'
        }
    }
})
.state('app.userProfile', {
    url: '/userProfile',
    views: {
        'menuContent': {
            templateUrl: 'templates/userProfile.html',
            controller: 'userProfileCtrl'
        }
    }
})
.state('app.matchingProperty', {
    url: '/matchingProperty',
    views: {
        'menuContent': {
            templateUrl: 'templates/matchingProperty.html',
            controller: 'matchingPropertyCtrl'
        }
    }
});
    // if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/app/Entrance');

});
