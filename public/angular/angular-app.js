'use strict';

angular.module('app', ['ui.bootstrap', 'restangular'])
    .config(function($routeProvider, RestangularProvider) {
        // configure routes
        $routeProvider
            .when('/',  { templateUrl: 'partials/home/', controller: 'HomeCtrl' })
            .otherwise({ redirectTo: '/' });

        // Use Mongo "_id" instead of "id"
        RestangularProvider.setRestangularFields({
            id: '_id'
        });

        RestangularProvider.addElementTransformer('companies', true, function(company) {
            company.addRestangularMethod('check', 'post', 'check');
            return company;
        });

    })
;