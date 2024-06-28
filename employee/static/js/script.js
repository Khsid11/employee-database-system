function addOrUpdateEmployee() {
    const employeeId = document.getElementById('employeeId').value;
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;

    if (name && position) {
        const employee = { name, position };

        if (employeeId) {
            employee.id = employeeId;
            fetch('/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('employeeId').value = '';
                    document.getElementById('name').value = '';
                    document.getElementById('position').value = '';
                    loadEmployees();
                }
            });
        } else {
            fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('name').value = '';
                    document.getElementById('position').value = '';
                    loadEmployees();
                }
            });
        }
    } else {
        alert('Please fill in both fields');
    }
}

function loadEmployees() {
    fetch('/employees')
    .then(response => response.json())
    .then(data => {
        const employeeList = document.getElementById('employeeList');
        employeeList.innerHTML = '';
        data.employees.forEach(employee => displayEmployee(employee));
    });
}

function displayEmployee(employee) {
    const employeeList = document.getElementById('employeeList');
    const employeeDiv = document.createElement('div');
    employeeDiv.classList.add('employee');
    employeeDiv.innerHTML = `
        <span>${employee.name} - ${employee.position}</span>
        <button class="edit" onclick="editEmployee(${employee.id}, '${employee.name}', '${employee.position}')">Edit</button>
        <button class="delete" onclick="deleteEmployee(${employee.id})">Delete</button>
    `;
    employeeList.appendChild(employeeDiv);
}

function editEmployee(id, name, position) {
    document.getElementById('employeeId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('position').value = position;
}


function searchEmployees() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const employeeDivs = document.querySelectorAll('.employee');

    employeeDivs.forEach(div => {
        const name = div.querySelector('.name').textContent.toLowerCase();
        const position = div.querySelector('.position').textContent.toLowerCase();
        if (name.includes(searchTerm) || position.includes(searchTerm)) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
}

document.getElementById('search').addEventListener('input', searchEmployees);


function deleteEmployee(id) {
    fetch(`/delete/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadEmployees();
        }
    });
}

window.onload = () => {
    loadEmployees();
};
