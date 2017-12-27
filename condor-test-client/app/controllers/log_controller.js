var controllerModule = angular.module('AppControllers');

controllerModule
	.controller('logController', ['$scope', 'logService','$stateParams', '$rootScope','toastr','DTOptionsBuilder',
    function ($scope, logService, $stateParams, $rootScope, toastr,DTOptionsBuilder) {
		var vm = this;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [7, 'desc']).withOption('lengthMenu', [20, 30, 50, 100]);
	   	$scope.logs = [];
        $scope.filters = {};
        $scope.sum = 0.0;
        $scope.t = 0;
        $scope.label = [];
        $scope.values = [];
        $scope.label1 = [];
        $scope.values1 = [];
        $scope.label2 = [];
        $scope.values2 = [];


        //parsing date
        function getDate(fecha){
    	  var fe = new Date(fecha.toString());
	      const d = (fe.getMonth()+1) + "/" + fe.getDate()  + "/" +fe.getFullYear();
	      return d.toString();
        }

        $scope.init = function () {
            const today = new Date();
            $scope.filters.startdate = getDate(today);
            $scope.filters.enddate = getDate(today);
            //I put FL DEFAULT because without this filter the response is too long and my computer does not support much  
			//but this can be changed by $scope.filters.state = '[statecode]'
            $scope.filters.state = 'FL';
            logService.getWithFilters($scope.filters).then(function (response) {
                $scope.logs = response.data;
                //get average and graphs
                $scope.loadData();

            }, function(error){
            	toastr.error("Error","Cannot load data");
            });
        }

        //Initializing datatable values
        $scope.init();

        //getting registers with selected filters
       $scope.lookForLogs =  function () {
            $scope.logs = [];
            $scope.filters.startdate = getDate($scope.startdate);
            $scope.filters.enddate = getDate($scope.enddate);
            if ($scope.state === null || $scope.state === undefined) {
                $scope.filters.state = '';
            } else {
                $scope.filters.state = $scope.state;
            }
            logService.getWithFilters($scope.filters).then(function (response) {
                $scope.logs = response.data;
                $scope.loadData();
            	
            },function(error){
            	toastr.error("Error","Cannot load data");
            });
        };
        
        $scope.loadData = function () {
        	//calculate The Total Average Response Time 
        	for(var i in $scope.logs){
        		var value = Math.abs(new Date($scope.logs[i].dt_Start_Log) - new Date($scope.logs[i].dt_end_log));
        		$scope.sum = $scope.sum + value;
        		$scope.t++;

        	}
        	$scope.average = $scope.sum / $scope.t;
        	$scope.graphPerDay();
        	$scope.graphPerMachine();
        	$scope.graphPerStatus();
        };

        //Draw The Average Response Time per Day
        $scope.graphPerDay = function(){
        	$scope.done = [];
        	$scope.label = [];
        	$scope.values = [];
        	$scope.data = [];
        	$scope.labels = [];
        	for(var i in $scope.logs){
				var data = getDate($scope.logs[i].dt_Start_Log);
				if($scope.done.indexOf(data) == -1){
					$scope.done.push(data);
					var acu = 0.0;
					var te = 0;
					for(var j in $scope.logs){
						if(getDate($scope.logs[j].dt_Start_Log) == data){
							acu = acu + Math.abs(new Date($scope.logs[j].dt_Start_Log) - new Date($scope.logs[j].dt_end_log));
							te++;
						}
					}
					const valueToSave = acu / te;
					$scope.label.push("start");
					$scope.label.push(data);
					$scope.values.push(0);
					$scope.values.push(valueToSave);
				}        		
        	}

		     $scope.datasetOverride = [
	          {
	            label: "Value",
	            borderWidth: 1,
	            type: 'bar'
	          },
	          {
	            label: "Progress",
	            borderWidth: 3,
	            hoverBackgroundColor: "rgba(255,99,132,0.4)",
	            hoverBorderColor: "rgba(255,99,132,1)",
	            type: 'line'
	          }
	        ];

        	$scope.labels = $scope.label;
        	$scope.data = [$scope.values ,$scope.values];


        };
        //Draw  The Total Requests per Machine 
    	$scope.graphPerMachine = function(){
	        	$scope.done = [];
	        	$scope.label1 = [];
	        	$scope.values1 = [];
	        	$scope.data1 = [];
	        	$scope.labels1 = [];
	        	var totalPerMachine = 0;
	        	for(var i in $scope.logs){
					var machine = $scope.logs[i].cd_machine;
					if($scope.done.indexOf(machine) == -1){
						$scope.done.push(machine);
						for(var j in $scope.logs){
							if($scope.logs[j].cd_machine == machine){
								totalPerMachine++;
							}
						}
						$scope.label1.push(machine);
						$scope.values1.push(totalPerMachine);
						totalPerMachine = 0;

					}        		
	        	}

	        	 $scope.datasetOverride1 = [
		          {
		            label: "Value",
		            borderWidth: 1,
		            type: 'bar'
		          },
		          {
		            label: "Progress",
		            borderWidth: 3,
		            hoverBackgroundColor: "rgba(255,99,132,0.4)",
		            hoverBorderColor: "rgba(255,99,132,1)",
		            type: 'line'
		          }
		        ];

	        	$scope.labels1 = $scope.label1;
	        	$scope.data1 = [$scope.values1,$scope.values1];

        };
        //Draw the Total Requests per Compliance Status
        $scope.graphPerStatus = function(){
        	$scope.done = [];
        	$scope.label2 = [];
        	$scope.values2 = [];
        	$scope.data2 = [];
        	$scope.labels2 = [];
        	var totalPerStatus = 0;
        	for(var i in $scope.logs){
				var status = $scope.logs[i].ds_compl_status_returned;
				if($scope.done.indexOf(status) == -1){
					$scope.done.push(status);
					for(var j in $scope.logs){
						if($scope.logs[j].ds_compl_status_returned == status){
							totalPerStatus++;
						}
					}
					$scope.label2.push(status);
					$scope.values2.push(totalPerStatus);
					totalPerStatus = 0;

				}        		
        	}

        	 $scope.datasetOverride2 = [
	          {
	            label: "Value",
	            borderWidth: 1,
	            type: 'bar'
	          },
	          {
	            label: "Progress",
	            borderWidth: 3,
	            hoverBackgroundColor: "rgba(255,99,132,0.4)",
	            hoverBorderColor: "rgba(255,99,132,1)",
	            type: 'line'
	          }
	        ];

        	$scope.labels2 = $scope.label2;
        	$scope.data2 = [$scope.values2,$scope.values2];
        };


        
	}])