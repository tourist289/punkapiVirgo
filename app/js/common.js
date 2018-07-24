$(document).ready(() => {

    const URL = "https://api.punkapi.com/v2/beers";

	$.getJSON(URL, function(data) {

		const items = data;

		function Display(range) {
			// item html

			let itemsHtml = range.map(
				item =>

			` <div class="col-md-4 col-sm-6 item" data-id="${item.id}">
				<div class="card js-card">
					<figure class="card__img ">
						<img class="img-fluid" src = "${item.image_url}" alt="${item.tagline}">
					</figure>
					<div class="card-body">
						<h5 class="card-title beer__name">${item.name} </h5>
						<p class="card-text">${item.description}</p>
					</div>
				</div>
			</div> `);

			$(".drinks").html(itemsHtml);
		}

        Display(items);

// clear filters
		$('.js-clear').on('click', () => {
            Display(items);
		});

		$('.dropdown-item').on('click', (e) => {
			let parentType = e.currentTarget.parentElement.dataset['filter'],
				value = e.currentTarget.innerText;

// sort by name
			if(parentType == 'name'){
				if(value == 'a - z'){
                    function compare(a, b) {
                        const genreA = a.name.toUpperCase();
                        const genreB = b.name.toUpperCase();
                        let comparison = 0;
                        if (genreA > genreB) {
                            comparison = 1;
                        } else if (genreA < genreB) {
                            comparison = -1;
                        }
                        return comparison;
                    }

                    items.sort(compare);
					Display(items);
				} else {
                    function compare(a, b) {
                        const genreA = a.name.toUpperCase();
                        const genreB = b.name.toUpperCase();
                        let comparison = 0;
                        if (genreA > genreB) {
                            comparison = 1;
                        } else if (genreA < genreB) {
                            comparison = -1;
                        }
                        return comparison * -1;
                    }

                    items.sort(compare);
                    Display(items);
				}
			}


// filter by abv
            if(parentType == 'abv'){
				if(value == '< 4.5'){
                    let lessStrong = data.filter(item => item.abv <= 4.5);
                    Display(lessStrong);
				} else {
                    let moreStrong = data.filter(item => item.abv >= 4.5);
                    Display(moreStrong);
				}
			}
		});


        // modal - extra info from data
        $(".js-card").on("click", function() {

            let id = $(this).parent()[0].dataset.id;
			let item = items[id - 1];

            let modalHtml =
				`
					<div class="card">
						
						<figure>
							<img class="img-fluid" src = "${item.image_url}" alt="${item.tagline}">
						</figure>
						<div class="card-body">
							<h5>${item.name} </h5>
							<p>${item.description}</p>
							<ul>
								<li>abv: ${item.abv}</li>
								<li>ph: ${item.ph}</li>
								
								
								<li>first brewed in: ${item.first_brewed}</li>
							</ul>
						</div>
					</div>
				 `;

            $(".modal__wrap .modal__content").html(modalHtml);

            modalWindow.openMyModal('#myModal' ); // "#thankModal"
        });
    });





//************ START MODAL
var modalWindow = (function() {

    var __curModal; // приватная переменная "#thankModal"

    return { // методы доступные извне

        setId(id) {
            this.__curModal = id;
        },
        getId() {
            return this.__curModal;
        },

        openMyModal(id) { //============ OPEN function
            let modalPrev = modalWindow.getId();

            if(modalPrev) {
                modalWindow.closeMyModal();
            }

            modalWindow.setId(id);
            if ($(id)[0].parentElement.className !== 'modal__overlay') {
                $(id).wrap("<div class='modal__overlay'></div>");
            }

            setTimeout(function () {
                let overlay = $(id).parent();
                $(id).css('display', 'block');
                overlay.fadeIn(400, modalWindow.setPosition());
                $('body').addClass(`modal_open`);

                // if slider in modal
                // $('.js_slider-nav-modal').resize();
                // $('.js_slider-for-modal').resize();
            }, 500);
        },

        closeMyModal() { //============ CLOSE function
            let modal = $( modalWindow.getId() );

            modal.animate({opacity: 0, top: '45%'}, 200);
            // modal.css('display', 'none');
            modal.parent('.modal__overlay').fadeOut(400);
            $('body').removeClass('modal_open');
            setTimeout(function () {
                modal.removeAttr('style');
            }, 400);

        },

        setPosition() { //========= Position function

            let modal = $( modalWindow.getId() ),
                position;

            setTimeout(function () {
                modal.stop();
                if (modal[0].clientHeight > $(window).height()) {
                    position = { // "TOP"
                        top: '20px',
                        marginTop: 0,
                        opacity: 1
                    };
                } else { // "CENTER"
                    position = {
                        top: $(window).height() / 2 + 'px',
                        opacity: 1,
                        marginTop: `-${modal[0].clientHeight / 2}px`
                    };
                }

                modal.animate( position, 350);
            }, 350);
        }
    };
}());
// SECOND part  @usage@

$('.js-modal').on('click', function () {
    modalWindow.openMyModal( $(this).data('modal') ); // "#thankModal"
});

//============ Position on orientationchange and resize
$(window).on("orientationchange resize", function () {
    if ( $('body').hasClass('modal_open')) {
        modalWindow.setPosition();
    }
});
//============  ESCAPE key pressed
$(document).keydown(function (e) {
    if ($('body').hasClass('modal_open')) {
        if (e.keyCode === 27) {
            modalWindow.closeMyModal();
        }
    }
});
//============ CLOSE on "close" button

$(window).on('click',  function (e) {
    if ($('body').hasClass('modal_open')) {
        if (e.target.className === 'modal__overlay') {
            modalWindow.closeMyModal();
        }
    }
});

$('.js-modal__close').on('click', () => modalWindow.closeMyModal()); // if class has children's
//============ END NEW MODAL

});