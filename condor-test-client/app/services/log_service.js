var servicesModule = angular.module('AppServices');
servicesModule.factory('logService', ['$http', 'config', function ($http, config) {
        return {
        	
            getWithFilters: function (params) {
                return $http.get(config.apiUrl +'?startdate=' + params.startdate + '&enddate=' + params.enddate + '&state=' + params.state);
            }
        };
    }]);
