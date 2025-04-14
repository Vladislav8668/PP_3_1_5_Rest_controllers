// Функции, которые будут запущены сразу после окончания полной загрузки страницы
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsersTable();
    addNewUser();
    getDefaultModal();
});

// Вспомогательный сервис с FETCH API
const adminFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {method: 'POST', headers: adminFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {method: 'PUT', headers: adminFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: adminFetchService.head})
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
            return role.name.substring(5);
        }).join(' ');
        row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.username}</td>
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
    // Обработчик кликов
    tableBody.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        const modal = document.getElementById('someDefaultModal');
        const buttonUserId = button.getAttribute('data-userid');
        const buttonAction = button.getAttribute('data-action');
        modal.setAttribute('data-userid', buttonUserId);
        modal.setAttribute('data-action', buttonAction);
    })
}

// Функция Для добавления нового пользователя
async function addNewUser() {
    const addNewUserButton = document.getElementById('addNewUserButton');
    if (addNewUserButton) {
        addNewUserButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const form = document.getElementById('userForm');
            // Проверяем все ли поля заполнены
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
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
            document.getElementById('admin-tab').click();
        });
    }
}

// Функция для вызова модального окна и выполнения действия в зависимости от того какая кнопка была нажата
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

// Функция для изменения пользователя
async function editUser(modal, id) {
    // Заполнение модального окна
    let preuser = await adminFetchService.findOneUser(id);
    let user = preuser.json();
    modal.find('.modal-title').html('Edit user');
    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);
    user.then(user => {
        let rolesOptions = '';
        rolesOptions += `<option value="1">USER</option>`;
        rolesOptions += `<option value="2">ADMIN</option>`;
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="form-group">
                    <label for="exampleInputIdDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Id</label>
                    <input type="text" class="form-control" id="id" placeholder="Id" value="${user.id}" disabled>
                </div>
                <div class="form-group">
                    <label for="exampleInputFirstDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">First name</label>
                    <input type="text" class="form-control" id="firstName" placeholder="First name" value="${user.firstName}">
                </div>
                <div class="form-group">
                    <label for="exampleInputLastDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Last name</label>
                    <input type="text" class="form-control" id="lastName" placeholder="Last name" value="${user.lastName}">
                </div>
                <div class="form-group">
                    <label for="exampleInputAgeDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Age</label>
                    <input type="number" class="form-control" id="age" placeholder="Age" value="${user.age}">
                </div>
                <div class="form-group">
                    <label for="exampleInputEmailDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Email</label>
                    <input type="email" class="form-control" id="Email" aria-describedby="emailHelp" placeholder="Email" value="${user.username}">
                </div>
                <div class="form-group">
                    <label for="password" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Password</label>
                    <input type="password" class="form-control" id="password" name="password" aria-describedby="emailHelp" placeholder="Password">
                </div>
                <label for="rolesDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Role</label>
                <select class="custom-select" multiple id="rolesEdit">
                    ${rolesOptions}
                </select>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })
    // Обработчик нажатия на кнопку изменения
    $("#editButton").on('click', async () => {
        const id = document.getElementById('id').value.trim();
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const age = document.getElementById('age').value.trim();
        const email = document.getElementById('Email').value.trim();
        const password = document.getElementById('password').value.trim();
        const roleSelect = document.getElementById('rolesEdit');
        const selectedRoles = Array.from(roleSelect.selectedOptions)
            .map(option => ({ id: option.value })); // Отправляем как массив объектов с id
        const data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            username: email,
            password: password,
            roles: selectedRoles
        };
        const response = await adminFetchService.updateUser(data, id);
        if (response.ok) {
            loadUsersTable();
            modal.modal('hide');
        } else {
            alert('This user does not exist');
        }
    })
}

// Функция для удаления пользователя
async function deleteUser(modal, id) {
    // Заполнение модального окна
    let preuser = await adminFetchService.findOneUser(id);
    let user = preuser.json();
    modal.find('.modal-title').html('Delete user');
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);
    user.then(user => {
        let rolesOptions = '';
        user.roles.forEach(role => {
            const roleName = role.name.substring(5);
            rolesOptions += `<option value="${role}">${roleName}</option>`;
        });
        let bodyForm = `
            <form class="form-group" id="deleteUser">
                <fieldset disabled>
                    <div class="form-group">
                        <label for="exampleInputIdDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Id</label>
                        <input type="text" class="form-control" id="id" placeholder="Id" value="${user.id}">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputFirstDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">First name</label>
                        <input type="text" class="form-control" id="firstName" placeholder="First name" value="${user.firstName}">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputLastDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Last name</label>
                        <input type="text" class="form-control" id="lastName" placeholder="Last name" value="${user.lastName}">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputAgeDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Age</label>
                        <input type="text" class="form-control" id="age" placeholder="Age" value="${user.age}">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmailDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Email</label>
                        <input type="text" class="form-control" id="Email" aria-describedby="emailHelp" placeholder="Email" value="${user.username}">
                    </div>
                    <label for="rolesDel" style="display: flex; justify-content: center; align-items: center; font-weight: bold;">Role</label>
                    <select class="custom-select" multiple id="rolesDel">
                        ${rolesOptions}
                    </select>
                </fieldset>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })
    // Обработчик нажатия на кнопку удаления
    $("#deleteButton").on('click', async () => {
        const response = await adminFetchService.deleteUser(id);
        loadUsersTable();
        modal.modal('hide');
    })
}
