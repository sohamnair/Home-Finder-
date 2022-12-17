(function($) {
    var commentForm = $('#postComment');
    var newComments = $('#new-comments');
    
    commentForm.submit(function(event) {
        event.preventDefault();
        var comment = $('#comment').val()
        var userId = $('#user_id').val();

        if(newComments) {
            var requestConfig = {
                method: 'POST',
                url: '/properties/property/comments/' + userId,
                contentType: 'application/json',
                data: JSON.stringify({
                    id: userId,
                    comment: comment,
                })
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                var newElement = $(responseMessage);
                console.log(newElement)
                newComments.append(newElement);
                $('#comment').val('');
            });
        }
    })

})(window.jQuery);