
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

dbRef.push({
    nameOfTea: 'Yucky',
    imgUpload: 'images/sampleImg1.JPG',
    type: 'black',
    tastingNotes: 'The simple things in life trying different restaurants vinyl records Game of Thrones. Theres no such thing as a typical Friday night grab coffee or a drink ask me anything Netflix but then it wouldnt be private, making people laugh the simple things in life fascinates me short-term dating easy-going.',
    nameOfUser: 'tif',
    shop: 'www.nepalieteatraders.com'
})


// render data to review cards
dbRef.on('child_added', function(snapshot) {
    const slickCarousel = $('#slick');
    const review = snapshot.val();

    const source = $("#handlebarReview").html();
    const template = Handlebars.compile(source);
    const renderedHTML = template(review);
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


    // duplicate handlebar div
    // const template = $('#handlebarReview').html();
    // for(let i = 0; i < 5; i++){
    //     $('#slick').append(template);
    // };


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

