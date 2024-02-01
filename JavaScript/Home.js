document.addEventListener("DOMContentLoaded", function () {
    var loadingElement = document.querySelector('.n-loading');
    var body = document.querySelector('body');

    function hideLoading() {
        loadingElement.style.display = 'none';
    }

    if (body.getAttribute('data-loaded') === 'true') {
        hideLoading();
    } else {
        window.addEventListener('load', function () {
            hideLoading();
            body.setAttribute('data-loaded', 'true');
        });
    }
});