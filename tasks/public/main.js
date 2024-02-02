const updateBtns = document.querySelectorAll('#update-btn');
const deleteBtn = document.querySelector('#delete-btn');

updateBtns.forEach(updateBtn => {
  updateBtn.addEventListener('click', _ => {
    // get the id from url parameter
    const taskId = updateBtn.dataset.id;
    console.log('clicked UPDATE btn', taskId);
    window.location.href =`/tasks/${taskId}/edit`
    // Fetch  the task with this ID and display it in the form for editing
    // fetch(`/tasks/${taskId}/edit`)
    // .then(res => res.json())
    //   .then((data) => {
    //     console.log('data', data)
    //   })
  });
})


deleteBtn.addEventListener('click', _ => {

});