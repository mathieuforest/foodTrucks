;(function () {
	
	'use strict';

	window.appData = {};

	var gridView = true, mapView = false;

	window.getTrucks = function(){

		var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(45.516577, -73.567586),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"saturation":-100},{"lightness":"50"},{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"lightness":"30"}]},{"featureType":"road.local","elementType":"all","stylers":[{"lightness":"40"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]},{"featureType":"water","elementType":"labels","stylers":[{"lightness":-25},{"saturation":-100}]}]
        };
		var map;
		$.ajax({
			type : 'GET',
			url : '/api/trucks',
			dataType : 'json',
			contentType : false,
			processData : false,
			beforeSend: function(){
				$('#ga-map').css({'height': $( window ).height() + 'px'});
				map = new google.maps.Map(
					document.getElementById('map'), 
					mapOptions
				);
			},
			success : function (trucks) {
				JSON.parse(trucks).map(truck => {
					var marker = new google.maps.Marker({
			          position: {lat: truck.lat, lng: truck.lng},
			          map: map,
			          title: truck.truck_name,
			          icon: truck.normal_pin_url,
			          clickable: true
			        });
			        marker.addListener('click', function() {
			        	getTruckMenu(truck.truck_id)
			        	console.log(truck)
			        });
					var element = '<div class="col-md-4 col-sm-6 col-xs-6 col-xxs-12 truck-item">'
						element += '<a href="#" data-truckId="'+truck.truck_id+'">'
						element += '<img src="https://lotmom.imgix.net/'+truck.truck_img+'?crop=faces&fit=crop&h=190&w=460" alt="'+truck.truck_name+'" class="img-responsive">'
						element += '<h3 class="fh5co-work-title">'+truck.truck_name+'</h3>'
						element += '<p>'+truck.address+'</p>'
						element += '<p>'+truck.date+'</p>'
						element += '<p>'+truck.formatted_date+'</p>'
						element += '</a>'
						element += '</div>'
					$('#gridView').append(element);	
				})
			},
			fail : function (){

			}
		});
	}

	window.getTruckMenu = function(truck_id){
		$.ajax({
			type : 'GET',
			url : '/api/truck/'+truck_id+'/menu',
			dataType : 'json',
			contentType : false,
			processData : false,
			beforeSend: function(){	
			},
			success : function (response) {
				var orderForm = '<section>'
				orderForm += '<h2>'+response.truck_desc[0].name+'</h2>'
				orderForm += '<img src='+response.truck_desc[0].img_url+' width="100%" />'
				orderForm += '<p>'+response.truck_desc[0].desc+'</p>'
				orderForm += '</section>'
				orderForm += '<form id="orderForm" data-truckId="'+truck_id+'">'
				response.truck_menu.map(truckMenuItem => {
					orderForm += '<section class="order-item">'
					orderForm += '<h3>'+truckMenuItem.name+'</h3>'
					orderForm += '<p>'+truckMenuItem.desc+'</p>'
					if(appData.hasOwnProperty('client')){
						orderForm += '<div class="input-group">'
						orderForm += '<input name="'+truckMenuItem.id+'" type="text" class="form-control" placeholder="Quantité" aria-describedby="basic-addon2">'
						orderForm += '<span class="input-group-addon" id="basic-addon2">x '+truckMenuItem.price.toFixed(2)+' $</span>'
						orderForm += '</div>'
					}
					orderForm += '</section>'
				})
				orderForm += '</form>'

				var clientForm = '<h3>Commander</h3>'
				if(appData.hasOwnProperty('client')){
					clientForm += '<form id="clientForm" data-truckId="'+truck_id+'">'
					clientForm += '<section class="order-item">'
					clientForm += '<div class="form-group">'
					clientForm += '<input value="'+ appData.client.first_name +'" name="first_name" type="text" class="form-control" placeholder="Prénom" aria-describedby="basic-addon2">'
					clientForm += '</div>'
					clientForm += '<div class="form-group">'
					clientForm += '<input value="'+ appData.client.last_name +'" name="last_name" type="text" class="form-control" placeholder="Nom de famille" aria-describedby="basic-addon2">'
					clientForm += '</div>'
					clientForm += '<div class="form-group">'
					clientForm += '<textarea name="address" class="form-control" placeholder="Adresse" rows="3">'+ appData.client.address +'</textarea>'
					clientForm += '</div>'
					clientForm += '<div class="form-group">'
					clientForm += '<input value="'+ appData.client.tel +'" name="tel" type="text" class="form-control" placeholder="Téléphone" aria-describedby="basic-addon2">'
					clientForm += '</div>'
					clientForm += '<div class="form-group">'
					clientForm += '<input value="'+ appData.client.email +'" name="email" type="email" class="form-control" placeholder="Courriel" aria-describedby="basic-addon2">'
					clientForm += '</div>'
					clientForm += '<div class="radio">'
					clientForm += '<label>'
					clientForm += '<input type="radio" name="delivery_pickup" id="optionsRadios1" value="delivery" checked>'
					clientForm += 'Livraison'
					clientForm += '</label>'
					clientForm += '</div>'
					clientForm += '<div class="radio">'
					clientForm += '<label>'
					clientForm += '<input type="radio" name="delivery_pickup" id="optionsRadios2" value="pickup">'
					clientForm += 'À emporter'
					clientForm += '</label>'
					clientForm += '</div>'
					clientForm += '</section>'
					clientForm += '</form>'
				} else {
					clientForm += '<section class="order-item">'
					clientForm += '<h5>Connectez-vous pour commander en ligne.</h5>'
					clientForm += '</section>'
				}

				if(appData.hasOwnProperty('client')){
					var clientFormButton = '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button><button id="submitOrderForm" type="button" class="btn btn-primary">Placer la commande</button>';
				} else {
					var clientFormButton = '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button><button id="logIn" type="button" class="btn btn-primary" data-dismiss="modal">Se connecter</button>'
				}

				$("#modal").find('.modal-title').html('Menu');
				$("#modal").find('.modal-body').html(orderForm + clientForm);
				$("#modal").find('.modal-footer').html(clientFormButton);
				$("#modal").find('#submitOrderForm').show();
				$("#modal").modal('show');
			},
			error : function (){

			}
		});
	}

	window.submitOrderForm = function(){
		var truck_id = $('form#orderForm').attr("data-truckId")
		var data = {
			order: JSON.stringify($('form#orderForm').serializeArray()),
			client: JSON.stringify($('form#clientForm').serializeArray())
		}
		$.ajax({
			type : 'POST',
			url : '/api/truck/'+truck_id+'/order',
			dataType : 'json',
			contentType : false,
			processData : false,
			data: JSON.stringify(data),
			beforeSend: function(){
			},
			success : function (response) {
				$("#modal").find('.modal-body').html('Commande envoyée!');
				$("#modal").find('#submitOrderForm').hide();
			},
			error : function (){
				$("#modal").find('.modal-body').html('Oups!');
			}
		});
	}

	window.logIn = function(){
		var logInForm = '<form id="logInForm">'
		logInForm += '<div class="form-group">'
		logInForm += '<label class="sr-only" for="exampleInputAmount">Courriel</label>'
		logInForm += '<div class="input-group">'
		logInForm += '<div class="input-group-addon">Courriel</div>'
		logInForm += '<input type="text" class="form-control" name="email" id="email" placeholder="Courriel">'
		logInForm += '</div>'
		logInForm += '<label class="sr-only" for="exampleInputAmount">Mot de passe</label>'
		logInForm += '<div class="input-group">'
		logInForm += '<div class="input-group-addon">Mot de passe</div>'
		logInForm += '<input type="password" class="form-control" name="password" id="password" placeholder="Mot de passe">'
		logInForm += '</div>'
		logInForm += '</div>'
		logInForm += '</form>'
		var logInFormButton = '<button id="createAccount" type="button" class="btn btn-default">Créer un compte</button><button id="submitLogIn" type="button" class="btn btn-primary">Se connecter</button>';

		$("#modal").find('.modal-title').html('Se connecter');
		$("#modal").find('.modal-body').html(logInForm);
		$("#modal").find('.modal-footer').html(logInFormButton);
		$("#modal").modal('show');
	}

	window.createAccount = function(){
		var createAccountForm = '<form id="createAccountForm">'
		createAccountForm += '<section>'
		createAccountForm += '<div class="form-group">'
		createAccountForm += '<input name="first_name" type="text" class="form-control" placeholder="Prénom" aria-describedby="basic-addon2">'
		createAccountForm += '</div>'
		createAccountForm += '<div class="form-group">'
		createAccountForm += '<input name="last_name" type="text" class="form-control" placeholder="Nom de famille" aria-describedby="basic-addon2">'
		createAccountForm += '</div>'
		createAccountForm += '<div class="form-group">'
		createAccountForm += '<textarea name="address" class="form-control" placeholder="Adresse" rows="3"></textarea>'
		createAccountForm += '</div>'
		createAccountForm += '<div class="form-group">'
		createAccountForm += '<input name="tel" type="text" class="form-control" placeholder="Téléphone" aria-describedby="basic-addon2">'
		createAccountForm += '</div>'
		createAccountForm += '<div class="form-group">'
		createAccountForm += '<input name="email" type="email" class="form-control" placeholder="Courriel" aria-describedby="basic-addon2">'
		createAccountForm += '</div>'
		createAccountForm += '<div class="input-group">'
		createAccountForm += '<div class="input-group-addon">Mot de passe</div>'
		createAccountForm += '<input type="password" class="form-control" name="password" id="password" placeholder="Mot de passe">'
		createAccountForm += '</div>'
		createAccountForm += '</div>'
		createAccountForm += '</form>'

		var createAccountFormButton = '<button id="submitCreateAccount" type="button" class="btn btn-default">Créer un compte</button>';

		$("#modal").find('.modal-title').html('Créer un compte');
		$("#modal").find('.modal-body').html(createAccountForm);
		$("#modal").find('.modal-footer').html(createAccountFormButton);
		$("#modal").modal('show');
	}

	window.submitCreateAccount = function(){
		$.ajax({
			type : 'POST',
			url : '/api/createAccount',
			dataType : 'json',
			contentType : false,
			processData : false,
			data: JSON.stringify($('form#createAccountForm').serializeArray()),
			beforeSend: function(){
				$("#modal").find('.modal-message').html('');
			},
			success : function (response) {
				$("#modal").find('.modal-body').html('Compte créé!');
				appData.client = response[0];
				updateMenu();
				setTimeout(function(){
					$("#modal").modal('hide');
				}, 1000)
			},
			error : function (err){
				$("#modal").find('.modal-message').html(JSON.parse(err.responseText)[0].error);
			}
		});
	}

	window.logOut = function(){
		delete window.appData.client
		updateMenu();
	}

	window.submitLogIn = function(){
		$.ajax({
			type : 'POST',
			url : '/api/login',
			data: JSON.stringify($('form#logInForm').serializeArray()),
			contentType: "application/json; charset=utf-8",
    		dataType: "json",
			beforeSend: function(){
			},
			success : function (response) {
				appData.client = response[0];
				updateMenu();
				var response = 'Connecté!';
				var responseButtons = '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>';				
				$("#modal").find('.modal-title').html('Se connecter');
				$("#modal").find('.modal-body').html(response);
				$("#modal").find('.modal-footer').html(responseButtons);
				setTimeout(function(){
					$("#modal").modal('hide');
				}, 1000)
			},
			error: function (err){
				var responseButtons = '<button id="logIn" type="button" class="btn btn-default" data-dismiss="modal">Réessayer</button>';
				$("#modal").find('.modal-title').html('Oups! Il y a eu un problème.');
				$("#modal").find('.modal-body').html(JSON.parse(err.responseText)[0].error);
				$("#modal").find('.modal-footer').html(responseButtons);
			}
		});
	}

	window.getMyOrders = function(){
		$.ajax({
			type : 'GET',
			url : '/api/orders',
			data: 'email='+appData.client.email,
			contentType : false,
			processData : false,
			beforeSend: function(){
			},
			success : function (orders) {
				var clientsOrder = '<div id="getMyOrdersList">';
				orders.map(order => {
					clientsOrder += '<section class="order-item">'
					var method = (order.delivery_pickup==='delivery')?'Livraison':'À Emporter'
					var date = (typeof order.date === 'string') ? order.date.replace('T', ' ').substring(0, order.date.length - 8) : '';
					clientsOrder += '<h5>Numéro de commande: <span class="label label-default">'+order.id+'</span>  <span class="label label-primary">'+method+'</span>  <span class="label label-default">'+ date +'</span></h5>'
					clientsOrder += '<h6>'+order.truck_data[0].name+'</h6>'
					clientsOrder += '<img src="'+order.truck_data[0].truck_img_url+'?crop=faces&fit=crop&h=190&w=460" width="100%" />'
					clientsOrder += '<ul class="list-group">'
					order.order.map(orderItem => {
						clientsOrder += '<li class="list-group-item">'
						clientsOrder += '<span class="badge">'+ orderItem.qty +'</span>'
						clientsOrder += orderItem.name + ' - ' + parseFloat(orderItem.price).toFixed(2) +' $'
						clientsOrder += '</li>'
					})
					clientsOrder += '</ul>'
					var status = (order.status==='submitted')?"En préparation":"Prête"
					clientsOrder += '<div class="alert alert-success" role="alert">'+status+'</div>'
					clientsOrder += '</section>'
				})	
				clientsOrder += '</div>'
				
				var myOrdersButtons = '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>';
				
				$("#modal").modal('show');
				$("#modal").find('.modal-title').html('Mes commandes');
				$("#modal").find('.modal-body').html(clientsOrder);
				$("#modal").find('.modal-footer').html(myOrdersButtons);
				$("#modal").modal('show');

			},
			error : function (){

			}
		});
	}

	window.updateMenu = function(){
		if(appData.hasOwnProperty('client')){
			$('#logIn').html('Se déconnecter').attr('id', 'logOut');
			$('#getMyOrders').toggle();
		} else {
			$('#logOut').html('Se connecter').attr('id', 'logIn');
			$('#getMyOrders').toggle();
		}
	}

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {
		$('#gridView').css('height', $(window).height());
		$(window).resize(function(){
			$('#gridView').css('height', $(window).height());
		});

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});
	};

	var parallax = function() {
		$(window).stellar({
			horizontalScrolling: false,
			hideDistantElements: false, 
			responsive: true

		});
	};

	var testimonialCarousel = function(){
		var owl = $('.owl-carousel-fullwidth');
		owl.owlCarousel({
			items: 1,
		    loop: true,
		    margin: 0,
		    responsiveClass: true,
		    nav: false,
		    dots: true,
		    smartSpeed: 500,
		    autoHeight: true
		});
	};


	// Animations

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {
			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				i++;
				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
				}, 100);
			}
		} , { offset: '85%' } );
	};

	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};

	var counterWayPoint = function() {
		if ($('#counter-animate').length > 0 ) {
			$('#counter-animate').waypoint( function( direction ) {	
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);					
					$(this.element).addClass('animated');
						
				}
			} , { offset: '90%' } );
		}
	};

	var burgerMenu = function() {
		$('.js-fh5co-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');	
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');	
			}
		});
	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {
		$(document).click(function (e) {
		    var container = $("#fh5co-aside, .js-fh5co-nav-toggle");
		    if (!container.is(e.target) && container.has(e.target).length === 0) {
		    	if ( $('body').hasClass('offcanvas') ) {
	    			$('body').removeClass('offcanvas');
	    			$('.js-fh5co-nav-toggle').removeClass('active');
		    	}
		    }
		});
		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {
    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');
			
	    	}
		});
	};

	$(document).on('click', '.toggleGridView', function(){
		if(gridView===false){
			gridView = true;
			mapView = false;
			$('#gridView').toggle();
		}
	}).on('click', '.toggleMapView', function(){
		if(mapView===false){
			gridView = false;
			mapView = true;
			$('#gridView').toggle();
		}
	}).on('click', 'a[data-truckId]', function(){
		getTruckMenu($(this).attr("data-truckId"))
	}).on('click', '#submitOrderForm', function() {
		submitOrderForm()
	}).on('click', '#getMyOrders', function() {
		getMyOrders()
	}).on('click', '#logIn', function() {
		$("#modal").modal('hide');
		setTimeout(function(){
			logIn();
		},500)
	}).on('click', '#submitLogIn', function() {
		submitLogIn();
	}).on('click', '#logOut', function() {
		logOut();
	}).on('click', '#createAccount', function() {
		createAccount();
	}).on('click', '#submitCreateAccount', function() {
		submitCreateAccount();
	});

	// Document on load.
	$(function(){
		fullHeight();
		parallax();
		testimonialCarousel();
		contentWayPoint();
		counterWayPoint();
		burgerMenu();
		mobileMenuOutsideClick();
	});


}());