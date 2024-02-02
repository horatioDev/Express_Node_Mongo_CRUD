const updateBtns = document.querySelectorAll('#update-btn');
const deleteBtn = document.querySelector('#delete-btn');

updateBtns.forEach(updateBtn => {
  updateBtn.addEventListener('click', _ => {
    // get the id from url parameter
    const contactId = updateBtn.dataset.id;
    console.log('clicked UPDATE btn', contactId);
    window.location.href =`/contacts/${contactId}/edit`
    // Fetch  the contact with this ID and display it in the form for editing
    // fetch(`/contacts/${contactId}/edit`)
    // .then(res => res.json())
    //   .then((data) => {
    //     console.log('data', data)
    //   })
  });
})


deleteBtn.addEventListener('click', _ => {

});