const updateBtns = document.querySelectorAll('#update-btn');
const deleteBtn = document.querySelector('#delete-btn');

updateBtns.forEach(updateBtn => {
  updateBtn.addEventListener('click', _ => {
    // get the id from url parameter
    const postId = updateBtn.dataset.id;
    console.log('clicked UPDATE btn', postId);
    window.location.href =`/posts/${postId}/edit`
    // Fetch  the post with this ID and display it in the form for editing
    // fetch(`/posts/${postId}/edit`)
    // .then(res => res.json())
    //   .then((data) => {
    //     console.log('data', data)
    //   })
  });
})


deleteBtn.addEventListener('click', _ => {

});