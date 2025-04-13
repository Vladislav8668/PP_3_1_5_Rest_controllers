// Функции, которые будут запущены сразу после окончания полной загрузки страницы
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsersTable();
    addNewUser();
});

// Вспомогательный сервис с FETCH API
const adminFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    // findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {method: 'POST', headers: adminFetchService.head, body: JSON.stringify(user)}),
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

// Функция Для добавления нового пользователя
async function addNewUser() {
    const addNewUserButton = document.getElementById('addNewUserButton');
    if (addNewUserButton) {
        addNewUserButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const firstName = document.getElementById('exampleInputFirst').value.trim();
            const lastName = document.getElementById('exampleInputLast').value.trim();
            const age = document.getElementById('exampleInputAge').value.trim();
            const email = document.getElementById('exampleInputEmail').value.trim();
            const password = document.getElementById('exampleInputPassword').value.trim();
            const roleSelect = document.getElementById('roles');
            const selectedRoles = Array.from(roleSelect.selectedOptions)
                .map(option => ({ id: option.value })); // Отправляем как массив объектов с id
            const data = {
                firstName: firstName,
                lastName: lastName,
                age: age,
                username: email,
                password: password,
                roles: selectedRoles
            };
            try {
                const response = await adminFetchService.addNewUser(data);
                if (response.ok) {
                    await loadUsersTable();
                    document.getElementById('exampleInputFirst').value = '';
                    document.getElementById('exampleInputLast').value = '';
                    document.getElementById('exampleInputAge').value = '';
                    document.getElementById('exampleInputEmail').value = '';
                    document.getElementById('exampleInputPassword').value = '';
                    document.getElementById('roles').value = '';
                }
            } catch (error) {
                console.error('Error adding new user:', error);
            }
            const tab = new bootstrap.Tab(document.getElementById('admin-tab'));
            tab.show();
        });
    }
}