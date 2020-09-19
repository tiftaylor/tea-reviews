$(document).ready(function(){
    
    // card slide deck
    $('#slick').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
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
    })


});

