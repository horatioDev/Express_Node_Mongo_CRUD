const updateBtns = document.querySelectorAll('#update-btn');
const deleteBtn = document.querySelector('#delete-btn');

updateBtns.forEach(updateBtn => {
  updateBtn.addEventListener('click', _ => {
    // get the id from url parameter
    const quoteId = updateBtn.dataset.id;
    console.log('clicked UPDATE btn', quoteId);
    window.location.href =`/quotes/${quoteId}/edit`
    // Fetch  the quote with this ID and display it in the form for editing
    // fetch(`/quotes/${quoteId}/edit`)
    // .then(res => res.json())
    //   .then((data) => {
    //     console.log('data', data)
    //   })
  });
})


deleteBtn.addEventListener('click', _ => {

});