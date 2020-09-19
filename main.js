$(document).ready(function(){
    
    // activate text transition
    function isTextInView(element, fullView) {
        const wFromTop = $(window).scrollTop()
        const wFromBot = wFromTop + $(window).height()
        const eOffsetTop = $(element).offset().top
        const eOffsetBot = eOffsetTop + $(element).height();

        if (fullView) {
            return wFromTop < eOffsetTop && eOffsetBot < wFromBot;
        } else {
            return eOffsetTop <= wFromBot && wFromTop <= eOffsetBot;
        }
    }

    const textFade = $(".text-fade");
    function activateText() {
        textFade.each(function() {
            var element = $(this);
            if (isTextInView(element, false)) {
                element.addClass("activate");
            }
        });
    }

    $(document).scroll(function() {
        activateText();
    });


    // duplicate handlebar div
    const template = $('#handlebarReview').html();
    for(let i = 0; i < 5; i++){
        $('#slick').append(template);
    };


    // card slide deck desktop view
    $('#slick').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });


    // upload img for review
    $('#img-input').on('change', function() {
        const reader = new FileReader();

        reader.onload = (e) => {
            $('#img-preview')
                .attr('src', e.target.result)
                .removeClass('no-image');
        }

        reader.readAsDataURL(this.files[0]);
    });


    // general calls
    activateText();
});

