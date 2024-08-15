;(function () {
	
	'use strict';



	// iPad and iPod detection	
	var isiPad = function(){
		return (navigator.platform.indexOf("iPad") != -1);
	};

	var isiPhone = function(){
	    return (
			(navigator.platform.indexOf("<i></i>Phone") != -1) || 
			(navigator.platform.indexOf("iPod") != -1)
	    );
	};

	
	

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#fh5co-offcanvas, .js-fh5co-close-offcanvas");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('#fh5co-offcanvas').hasClass('animated fadeInLeft') ) {

    			$('#fh5co-offcanvas').addClass('animated fadeOutLeft');
				setTimeout(function(){
					$('#fh5co-offcanvas').css('display', 'none');	
					$('#fh5co-offcanvas').removeClass('animated fadeOutLeft fadeInLeft');
				}, 1000);
				$('.js-fh5co-nav-toggle').removeClass('active');
				
	    	}
	    
	    	
	    }
		});

		$('body').on('click', '.js-fh5co-close-offcanvas', function(event){
		

	  		$('#fh5co-offcanvas').addClass('animated fadeOutLeft');
			setTimeout(function(){
				$('#fh5co-offcanvas').css('display', 'none');	
				$('#fh5co-offcanvas').removeClass('animated fadeOutLeft fadeInLeft');
			}, 1000);
			$('.js-fh5co-nav-toggle').removeClass('active');

	    	event.preventDefault();

		});

	};

	

	

	// Burger Menu
	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event){

			var $this = $(this);

			$('#fh5co-offcanvas').css('display', 'block');
			setTimeout(function(){
				$('#fh5co-offcanvas').addClass('animated fadeInLeft');
			}, 100);
			
			// $('body').toggleClass('fh5co-overflow offcanvas-visible');
			$this.toggleClass('active');
			event.preventDefault();

		});

	};

	var scrolledWindow = function() {

		$(window).scroll(function(){

			var header = $('#fh5co-header'),
				scrlTop = $(this).scrollTop();


		   $('#fh5co-home .flexslider .fh5co-overlay').css({
				'opacity' : (.5)+(scrlTop/2000)
		   });

		   if ( $('body').hasClass('offcanvas-visible') ) {
		   	$('body').removeClass('offcanvas-visible');
		   	$('.js-fh5co-nav-toggle').removeClass('active');
		   }
		 
		});

		$(window).resize(function() {
			if ( $('body').hasClass('offcanvas-visible') ) {
		   	$('body').removeClass('offcanvas-visible');
		   	$('.js-fh5co-nav-toggle').removeClass('active');
		   }
		});
		
	};


	

	// Page Nav
	var clickMenu = function() {
		var topVal = ( $(window).width() < 769 ) ? 0 : 58;

		$(window).resize(function(){
			topVal = ( $(window).width() < 769 ) ? 0 : 58;		
		});

		if ( $(this).attr('href') != "#") {
			$('#fh5co-main-nav a:not([class="external"]), #fh5co-offcanvas a:not([class="external"])').click(function(event){
				var section = $(this).data('nav-section');


				if ( $('div[data-section="' + section + '"]').length ) {

					$('html, body').animate({
			        	scrollTop: $('div[data-section="' + section + '"]').offset().top - topVal
			    	}, 500);	
			    	
			   }
			   event.preventDefault();

			});
		}

		


	};


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
							el.addClass('fadeInUp animated');
							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );


	};

	var initializeWeb5 = async function() {
		const { web5, did: userDid } = await Web5.Web5.connect();
        console.log(web5, userDid);

		const response = await web5.dwn.records.query({
            from: 'did:dht:bi3bzoke6rq6fbkojpo5ebtg45eqx1owqrb4esex8t9nz14ugnao',
			// from: 'did:dht:1ko4cqh7c7i9z56r7qwucgpbra934rngc5eyffg1km5k6rc5991o',
            message: {
              filter: {
                protocol: 'https://schema.ariton.app/text',
                protocolPath: "entry",
                schema: 'https://schema.ariton.app/text/schema/entry',
                dataFormat: 'application/json',
              },
            },
          });

          console.log("response from query", response);

		  const template = document.getElementById('template');
		  const parentElement = document.getElementById('articles');

		  for (const record of response.records) {
			// We only retrieve the data for read-more.
			// const data = record.data.json();
			const clonedTemplate = template.cloneNode(true);

			// Remove a class by name from the cloned template
			clonedTemplate.classList.remove('hidden');

			clonedTemplate.querySelector('.img-responsive').src = record.tags.image;
			clonedTemplate.querySelector('.article-link').innerText = record.tags.title;
			clonedTemplate.querySelector('.article-date').innerText = new Date(record.dateModified).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

			// Modify the cloned template as needed
			// For example, if the template has a child element with class 'content', you can modify its text content
			// clonedTemplate.querySelector('.content').textContent = // record.data.json().content;

			// Append the cloned template to the parent element
			parentElement.insertBefore(clonedTemplate, parentElement.firstChild);
		  }

		  template.classList.add('hidden');

		// Animations
		contentWayPoint();
	};


	// Document on load.
	$(function(){

		mobileMenuOutsideClick();
		burgerMenu();
		scrolledWindow();
		
		initializeWeb5();

	});


}());