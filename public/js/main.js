const updateBtns = document.querySelectorAll('#update-btn');
const deleteBtns = document.querySelectorAll('#delete-btn');
// const cancelBtns = document.querySelectorAll('#cancel-btn');
const cancelBtns = document.querySelectorAll('#cancel-btn');
const saveBtns = document.querySelectorAll('#save-btn');

// updateBtns.forEach(updateBtn => {
//   updateBtn.addEventListener('click', _ => {
//     // Current route
//     let routeName = updateBtn.dataset.name;
//     let userId;
//     console.log('Rt Name:', routeName)
//     console.log('clicked UPDATE btn', userId);
//     // get the id from url parameter
//     switch (routeName) {
//       case 'contacts':
//         userId = updateBtn.dataset.id;
//         window.location.href = `/contacts/${userId}/edit`;
//         break;
//       case 'posts':
//         userId = updateBtn.dataset.id;
//         window.location.href = `/posts/${userId}/edit`;
//         break;
//       case 'tasks':
//         userId = updateBtn.dataset.id;
//         window.location.href = `/tasks/${userId}/edit`;
//         break;
//       case 'employees':
//         userId = updateBtn.dataset.id;
//         window.location.href = `/employees/${userId}/edit`;
//         break;
//       case 'quotes':
//         userId = updateBtn.dataset.id;
//         window.location.href = `/quotes/${userId}/edit`;
//         break;

//       default:
//         // return req.url
//         break;
//     });
// })

updateBtns.forEach(updateBtn => {
  updateBtn.addEventListener('click', _ => {
    // Current route
    let routeName = updateBtn.dataset.name;
    let userId;
    console.log('Rt Name:', routeName);
    // get the id from url parameter
    if (routeName === 'contacts') {
      userId = updateBtn.dataset.id;
      window.location.href = `/contacts/${userId}/edit`;
    } else if (routeName === 'posts') {
      userId = updateBtn.dataset.id;
      window.location.href = `/posts/${userId}/edit`;
    } else if (routeName === 'tasks') {
      userId = updateBtn.dataset.id;
      window.location.href = `/tasks/${userId}/edit`;
    } else if (routeName === 'employees') {
      userId = updateBtn.dataset.id;
      window.location.href = `/employees/${userId}/edit`;
    } else if (routeName === 'quotes') {
      userId = updateBtn.dataset.id;
      window.location.href = `/quotes/${userId}/edit`;
    } else {
      // Handle the default case if needed
      return
    }
    console.log('clicked UPDATE btn', userId);
  });
});


function getEditFormData() {
  const form = document.getElementById('editForm');
  const formData = {}
  const editForm = new FormData(form);
  for (const [key, val] of editForm.entries()) {
    formData[key] = val;
  }
  console.log(formData)
  return formData;
}

// handle when a user clicks "Save Changes"
saveBtns.forEach(saveBtn => {
  saveBtn.addEventListener("click", _ => {
    let routeName = saveBtn.dataset.name;
    let userId = saveBtn.dataset.id;
    console.log(routeName, userId)
    let updatedData = getEditFormData();
    // send PUT request to server with updated information
    fetch(`/${routeName}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    }).then(_ => {
      // Re-direct
      window.location.href = `/${routeName}`;
    })
      .catch(err => console.error(err))
  })

});


cancelBtns.forEach(cancelBtn => {
  cancelBtn.addEventListener('click', () => {
    console.log('click', cancelBtn.dataset.id);
    window.location.href = '/contacts'
  });
});

deleteBtns.forEach(deleteBtn => {
  deleteBtn.addEventListener('click', _ => {
    let routeName = deleteBtn.dataset.name;
    let userId = deleteBtn.dataset.id;
    fetch(`/${routeName}/${userId}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(contactDeleteData)
    })
      .then(res => {
        if (res.ok) {
          console.log(res)
          return res.json()
        }
      })
      .then(data => {
        console.log('Deleted:', data)
        // alert('Your changes have been saved!')
        window.location.reload()
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while deleting the contact. Please try again later.');
      })
  });
});