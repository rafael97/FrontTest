var CondorTest = angular.module("CondorTest", [
	"ui.router",
	"AppControllers",
	"AppServices",
	"toastr",
	"datatables",
	"cp.ngConfirm",
	"chart.js"
	]);

// Import environment variables if present (from env.js)
const env = {};
if(window) Object.assign(env, window.__env);
CondorTest.constant("config", env);

CondorTest.config(["$stateProvider", "$urlRouterProvider", "toastrConfig","$qProvider","$locationProvider","ChartJsProvider",
	function($stateProvider, $urlRouterProvider, toastrConfig, $qProvider,$locationProvider,ChartJsProvider){
		$qProvider.errorOnUnhandledRejections(false);
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('');

		ChartJsProvider.setOptions({
        	chartColors: ['#45b7cd', '#ff6384', '#ff8e72'],
      		responsive: false
        });


		ChartJsProvider.setOptions('line', {
	      showLines: false
	    });



		angular.extend(toastrConfig, {
		autoDismiss: false,
		containerId: 'toast-container',
		maxOpened: 0,
		newestOnTop: true,
		positionClass: 'toast-top-right',
		preventDuplicates: false,
		preventOpenDuplicates: false,
		target: 'body'
	});


		$urlRouterProvider.otherwise("/app/home");
		$stateProvider
			.state("main",{
				url: "/app",
				templateUrl: "/app/views/main.html"
			})
			.state("main.home", {
				url: "/home",
				templateUrl: "/app/views/home.html",
				controller: "logController"
			})
	}]);
