
// Firebase Configuration
const firebaseConfig = {
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


// Global Variables
const dbRef = firebase.database().ref('reviews');
let currentQuery = dbRef;
const teaTypeMap = {
    'Ripe Puer': 'Ripe Pu’er',
    'Raw Puer': 'Raw Pu’er',
    'White': 'White',
    'Green': 'Green',
    'Oolong': 'Oolong',
    'Black': 'Black'
};
const urlCheck = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;


// Set up Slick Carousel
function createSlick () {
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
}


// Review Data
function publishReviewData (e) {
    e.preventDefault();
    const reviewData = {};

    reviewData.nameOfTea = $('#nameOfTea').val();
    reviewData.imgUpload = getImgURL();
    reviewData.type = $('#typeOfTea').val();
    reviewData.tastingNotes = $('#reviewText').val();
    reviewData.nameOfUser = $('#userName').val();
    reviewData.shop = $('#shopName').val();
    reviewData.shopURL = $('#shopURL').val();
    
    dbRef.push(reviewData);

    // scroll to carousel
    $('body, html').animate({
        scrollTop: $('#teaReviewSection').offset().top
    }, 800);

    // reset the "form"
    removeCropper();
    $('.btn-secondary').text('Select Tea Image');
    $('input[type=text]').val('');
    $('textarea').val('');
    $('select').val('White');
    $('#img-preview').attr('src', 'images/mug-hot-solid.svg');
    $('#img-input').val('');
}


function filterReviewData () {
    const slickCarousel = $('#slick');
    const typeBtnClicked = $(this).data("teatype");
    currentQuery.off();

    if($(this).hasClass('active')){
        currentQuery = dbRef;
        $('.tea-button').removeClass('active');
    } else {
        currentQuery = dbRef.orderByChild('type').equalTo(typeBtnClicked);
        $('.tea-button').removeClass('active');
        $(this).addClass('active');
        $('body, html').animate({
            scrollTop: $('#teaReviewSection').offset().top
        }, 800);
    }

    slickCarousel.slick('slickRemove', null, null, true);
    slickCarousel.addClass('loading');
    currentQuery.on('child_added', renderToSlick);
}


function renderToSlick (snapshot) {
    const slickCarousel = $('#slick');
    const reviewData = snapshot.val();

    reviewData.type = teaTypeMap[reviewData.type];
    if(reviewData.shopURL && !reviewData.shopURL.startsWith('http')) {
        reviewData.shopURL = '//' + reviewData.shopURL;
    }
    
    const source = $("#handlebarReview").html();
    const template = Handlebars.compile(source);
    const renderedHTML = template(reviewData);
    slickCarousel.slick('slickAdd', renderedHTML, undefined, true);
    slickCarousel.removeClass('loading');
}


// Select Img for Crop -- Get Cropped Img URL -- Remove Cropper Img
function handleImgSelection () {
    const reader = new FileReader();

    reader.onload = (e) => {
        var $image = $('#img-preview');
        $('.btn-secondary').text('Need a different one?')
        $image
            .attr('src', e.target.result)
            .removeClass('no-image');

        const cropper = $image.data('cropper');
        if (cropper) {
            cropper.replace(e.target.result);
        } else {
            $image.cropper({
                aspectRatio: 1 / 1,
                viewMode: 2,
                zoomable: false,
            });
        }
    }

    reader.readAsDataURL(this.files[0]);
}


function getImgURL () {
    const cropper = $('#img-preview').data('cropper');
    if(cropper){
        return cropper.getCroppedCanvas().toDataURL();
    } else {
        return $('#img-preview').attr('src');
    }
    
}


function removeCropper () {
    $('#img-preview').cropper('destroy').addClass('no-image');
}


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

function activateText() {
    $(".text-fade").each(function() {
        var element = $(this);
        if (isTextInView(element, false)) {
            element.addClass("activate");
        }
    });
}


// textarea character count
function charCount(val) {
    let length = val.value.length;
    $('#displayCharNum').text(300 - length);
}


function checkURL(e) {
    let value = e.target.value;
    let valid = false;

    if (value.startsWith('java')) {
        valid = false;
    } else if (value.match(urlCheck)) {
        valid = true;
    }

    if (!valid) {
        e.target.setCustomValidity('Please use www.website.com format');
    } else {
        e.target.setCustomValidity('');
    }
    $('#review')[0].reportValidity();
}


// query ready 
$(document).ready(function(){
    activateText();
    createSlick();

    $(document).on('scroll', activateText);
    $('#img-input').on('change', handleImgSelection);
    $('#shopURL').on('change', checkURL);
    $('#review').on('submit', publishReviewData);
    // all data
    currentQuery.on('child_added', renderToSlick);
    // filtered data
    $('.tea-button').on('click', filterReviewData);
    
});


