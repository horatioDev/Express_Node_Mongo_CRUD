const updateBtns = document.querySelectorAll('#update-btn');
const deleteBtn = document.querySelector('#delete-btn');

updateBtns.forEach(updateBtn => {
  updateBtn.addEventListener('click', _ => {
    // get the id from url parameter
    const employeeId = updateBtn.dataset.id;
    console.log('clicked UPDATE btn', employeeId);
    window.location.href =`/employees/${employeeId}/edit`
    // Fetch  the employee with this ID and display it in the form for editing
    // fetch(`/employees/${employeeId}/edit`)
    // .then(res => res.json())
    //   .then((data) => {
    //     console.log('data', data)
    //   })
  });
});


deleteBtn.addEventListener('click', _ => {
  console.log('Delete Clicked')
});