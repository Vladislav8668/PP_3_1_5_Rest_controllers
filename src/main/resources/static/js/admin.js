// document.addEventListener('DOMContentLoaded', async () => {
//     await getTableWithUsers();
//     getNewUserForm();
//     getDefaultModal();
//     addNewUser();
// });

document.addEventListener('DOMContentLoaded', async () => loadUsersTable());

const adminFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    // findOneUser: async (id) => await fetch(`api/users/${id}`),
    // addNewUser: async (user) => await fetch('api/users', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    // updateUser: async (user, id) => await fetch(`api/users/${id}`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    // deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

// Функция для заполнения таблицы всех пользователей
async function loadUsersTable() {
    let preusers = await adminFetchService.findAllUsers();
    let users = await preusers.json();
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        const roles = user.roles.map(role => {
            return role.name.startsWith('ROLE_') ? role.name.substring(5) : role.name;
        }).join(' ');
        row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName || ''}</td>
                    <td>${user.lastName || ''}</td>
                    <td>${user.age || ''}</td>
                    <td>${user.username || ''}</td>
                    <td>${roles}</td>
                    <td>
                        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#someDefaultModal"
                        data-userid="${user.id}" data-action="edit">Edit</button>
                    </td>
                    <td>                    
                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#someDefaultModal"
                        data-userid="${user.id}" data-action="delete">Delete</button>
                    </td>
                `;
        tableBody.appendChild(row);
    });
}

// <button type="button" data-userid="${user.id}" data-action="edit" className="btn btn-outline-secondary"
//         data-toggle="modal" data-target="#someDefaultModal"></button>

// <button type="button" data-userid="${user.id}" data-action="delete" className="btn btn-outline-danger"
//         data-toggle="modal" data-target="#someDefaultModal"></button>
