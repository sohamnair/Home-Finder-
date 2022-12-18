(function($) {
    var commentForm = $('#postComment');
    var wholePage = $('#whole-page');

    commentForm.submit(function(event) {
        event.preventDefault();
        var comment = $('#comment').val()
        var userId = $('#user_id').val();
        if(comment) {
            var requestConfig = {
                method: 'POST',
                url: '/properties/property/comments/'+userId,
                contentType: 'application/json',
                data: JSON.stringify({
                    id: userId,
                    comment: comment,
                })
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                var newElement = $(responseMessage);
                wholePage.replaceWith(newElement);
            });
        }
    })

})(window.jQuery);
