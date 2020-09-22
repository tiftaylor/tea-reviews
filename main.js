
// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyD2gm78P-MUB-uQujTozkxNIhZAXFOaDtU",
    authDomain: "tea-review-f07f3.firebaseapp.com",
    databaseURL: "https://tea-review-f07f3.firebaseio.com",
    projectId: "tea-review-f07f3",
    storageBucket: "tea-review-f07f3.appspot.com",
    messagingSenderId: "859918162530",
    appId: "1:859918162530:web:4c8bf20e069f2969774f3b",
    measurementId: "G-TMZTB5PDS6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let database = firebase.database();

const dbRef = database.ref('reviews')

$('#reviewData').on('click', function() {
    let reviewData = {};

    reviewData.nameOfTea = $('#nameOfTea').val();
    reviewData.imgUpload = $('#img-preview').attr('src');
    reviewData.type = $('#typeOfTea').val();
    reviewData.tastingNotes = $('#reviewText').val();
    reviewData.nameOfUser = $('#userName').val();
    reviewData.shop = $('#shopName').val();
    reviewData.shopURL = $('#shopURL').val();
    
    dbRef.push(reviewData);

    // reset the "form"
    $('input[type=text]').val('');
    $('textarea').val('');
    $('select').val('white');
    $('#img-preview').attr('src', 'images/mug-hot-solid.svg');
    $('#img-input').val('');
});



// render data to review cards
dbRef.on('child_added', function(snapshot) {
    const slickCarousel = $('#slick');
    const reviewData = snapshot.val();

    const source = $("#handlebarReview").html();
    const template = Handlebars.compile(source);
    const renderedHTML = template(reviewData);
    slickCarousel.slick('slickAdd', renderedHTML);
  });


// query ready 
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

