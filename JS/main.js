// users scripts
// get user data from inputs
$("#user-register-btn").on("click", () => {
    let userObj = {
        username: $("#add-user-name").val(),
        email:  $("#add-user-email").val(),
        password:  $("#add-user-password").val()
    };

    $("#add-user-name").val('')
    $("#add-user-email").val('')
    $("#add-user-password").val('')

    createUser(userObj)
})

// add users
function createUser(userObj){
    fetch("http://localhost:8000/users", {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        }
    });
}
// end users sripts

// reviews scripts
// add review logic
$("#add-review-btn").on("click", () => {
    let reviewObj = {
        trailer: $("#add-review-trailer").val(),
        title: $("#add-review-title").val(),
        desc: $("#add-review-desc").val(),
        likeCount: 0,
        user: $("#add-review-user").val()
    };

    $("#add-review-trailer").val('')
    $("#add-review-title").val('')
    $("#add-review-desc").val('')
    $("#add-review-user").val('')

    createReview(reviewObj)
});

async function createReview(reviewObj){
    await fetch("http://localhost:8000/reviews", {
        method: "POST",
        body: JSON.stringify(reviewObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        }
    });
    render()
}

// render func for dynamic content
let page = 1;

async function render(){
    let res = await fetch(`http://localhost:8000/reviews/?_page=${page}&_limit=3`)
    let data = await res.json()
    $('.cards').html('')
    data.forEach(item => {
        $('.cards').append(`<div class="card" style="width: 18rem;" id="${item.id}">
                                <iframe src="${item.trailer}"></iframe>
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.desc}</p>
                                    <p>added by: ${item.user}</p>
                                    <p>Likes: ${item.likeCount}</p>
                                    <a href="#" class="btn btn-primary">LIKE</a>
                                    <a href="#" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleAddReviewModal">UPDATE</a>
                                    <a href="#" class="btn btn-danger">DELETE</a>
                                </div>
                            </div>`)
    })

    if(page <= 1){
        $('#previous-btn').css('display', 'none')
    }else($('#previous-btn').css('display', 'block'))

}

// delete review
$('body').on('click', '.btn-danger', function(e){
    let id = e.target.parentNode.parentNode.id
    fetch(`http://localhost:8000/reviews/${id}`, {
        method: "DELETE"
    })
        .then(() => render())
})

// update review
// detail review data
async function getDetailData(id){
    let res = await fetch(`http://localhost:8000/reviews/${id}`)
    let data = await res.json()
    return data
}

// update
$('body').on('click', '.btn-success', async function(e){
    let id = e.target.parentNode.parentNode.id
    let data = await getDetailData(id)

    $("#add-review-trailer").val(data.trailer)
    $("#add-review-title").val(data.title)
    $("#add-review-desc").val(data.desc)
    $("#add-review-user").val(data.user)

    $('.edit-review-btn').attr('id', data.id)

})

$('body').on('click', '.edit-review-btn', async function(e){
    let id = e.target.id
    let data = await getDetailData(id)

    let newReviewObj = {
        trailer: $("#add-review-trailer").val(),
        title: $("#add-review-title").val(),
        desc: $("#add-review-desc").val(),
        likeCount: data.likeCount,
        user: $("#add-review-user").val()
    }

    $("#add-review-trailer").val('')
    $("#add-review-title").val('')
    $("#add-review-desc").val('')
    $("#add-review-user").val('')

    await fetch(`http://localhost:8000/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newReviewObj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(() => render())
})

// pagination
$('#next-btn').on('click', (e) => {
    page++
    render()
})

$('#previous-btn').on('click', (e) => {
    page--
    render()
})

render()
// end reviews scripts


