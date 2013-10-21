'use strict';

angular.module('app').controller('HomeCtrl', function($scope, $modal){

    $scope.registerCompany = function(){
        $modal.open({
            templateUrl: 'partials/home/register.html',
            backdrop: 'static',
            controller: 'RegisterCompanyCtrl'
        });
    };

});

angular.module('app').controller('RegisterCompanyCtrl', function ($scope, $modalInstance, $timeout, Restangular) {
    $scope.company = {};
    $scope.step = 1;
    $scope.registering = false;
    $scope.error = '';

    $scope.register = function () {
        $scope.error = '';
        $scope.registering = true;
        Restangular.all('companies').post($scope.company)
        .then(
            function success(response){
                $scope.registering = false;
                $scope.step = 2;
            },
            function error(response){
                $scope.registering = false;
                $scope.step = 1;
                $scope.error = response.data.error;
            }
        );
    };

    $scope.close = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



    var keys = {};
    var delayedCheck;

    function checkKey(key){
        keys[key] = 'checking';
        Restangular.all('companies').check({ key: key })
        .then(
            function success(response){
                keys[key] = response.available ? 'available' : 'unavailable';
            },
            function error(){
                delete keys[key];
            }
        );
    }

    $scope.checkKeyDelayed = function(key){
        // on key change, cancel delayed check not yet performed
        $timeout.cancel(delayedCheck)
        // if key not empty and not checked already
        if (key && !keys[key]) {
            // schedule a check after a small delay
            delayedCheck = $timeout(function() {
                checkKey(key);
            }, 1000);
        }
    };

    $scope.isChecking = function(key){
        return keys[key] == 'checking';
    };
    $scope.isAvailable = function(key){
        return keys[key] == 'available';
    };
    $scope.isUnavailable = function(key){
        return keys[key] == 'unavailable';
    };

});

