// API Configuration
const API_BASE = '/api';

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageName).classList.add('active');
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Load data for the page
    if (pageName === 'home') {
        loadDashboard();
    } else if (pageName === 'employees') {
        loadEmployees();
    } else if (pageName === 'attendance') {
        loadAttendanceList();
        loadEmployeesForFilter();
    }
}

// Set today's date in attendance form
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('attDate');
    if (dateInput) {
        dateInput.value = today;
    }

    // Load initial dashboard
    loadDashboard();

    // Event listeners
    document.getElementById('employeeForm').addEventListener('submit', handleAddEmployee);
    document.getElementById('attendanceForm').addEventListener('submit', handleMarkAttendance);
    document.getElementById('filterEmployee').addEventListener('change', loadAttendanceList);
});

// ==================== Dashboard ====================
async function loadDashboard() {
    try {
        const empResponse = await fetch(`${API_BASE}/employees`);
        const attResponse = await fetch(`${API_BASE}/attendance`);

        const employees = await empResponse.json();
        const attendance = await attResponse.json();

        const today = new Date().toLocaleDateString();
        const todayRecords = (attendance.data || []).filter(record => {
            const recordDate = new Date(record.date).toLocaleDateString();
            return recordDate === today;
        });

        document.getElementById('totalEmployees').textContent = employees.count || 0;
        document.getElementById('totalRecords').textContent = attendance.count || 0;
        document.getElementById('presentToday').textContent = todayRecords.filter(r => r.status === 'Present').length;
        document.getElementById('absentToday').textContent = todayRecords.filter(r => r.status === 'Absent').length;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ==================== Employees ====================
async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE}/employees`);
        const data = await response.json();

        const list = document.getElementById('employeesList');

        if (data.count === 0) {
            list.innerHTML = '<div class="empty-state"><div>👥</div>No employees found. Add a new employee to get started.</div>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.data.forEach(emp => {
            html += `
                <tr>
                    <td>${emp.employee_id}</td>
                    <td>${emp.full_name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteEmployee(${emp.id}, '${emp.employee_id}')">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        list.innerHTML = html;
    } catch (error) {
        console.error('Error loading employees:', error);
        document.getElementById('employeesList').innerHTML = '<div class="empty-state"><div>⚠️</div>Error loading employees</div>';
    }
}

async function handleAddEmployee(e) {
    e.preventDefault();

    const formData = {
        employee_id: document.getElementById('empId').value.trim(),
        full_name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        department: document.getElementById('department').value
    };

    // Clear previous errors
    document.getElementById('empIdError').textContent = '';
    document.getElementById('fullNameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('departmentError').textContent = '';

    try {
        const response = await fetch(`${API_BASE}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        const messageDiv = document.getElementById('employeeFormMessage');

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Employee added successfully!';
            document.getElementById('employeeForm').reset();
            setTimeout(() => loadEmployees(), 500);
            setTimeout(() => messageDiv.textContent = '', 3000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || 'Failed to add employee';
        }
    } catch (error) {
        const messageDiv = document.getElementById('employeeFormMessage');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error: ' + error.message;
    }
}

async function deleteEmployee(id, empId) {
    if (confirm(`Are you sure you want to delete ${empId}?`)) {
        try {
            const response = await fetch(`${API_BASE}/employees/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadEmployees();
            } else {
                alert('Failed to delete employee');
            }
        } catch (error) {
            alert('Error deleting employee: ' + error.message);
        }
    }
}

// ==================== Attendance ====================
async function loadEmployeesForFilter() {
    try {
        const response = await fetch(`${API_BASE}/employees`);
        const data = await response.json();

        const select = document.getElementById('filterEmployee');
        select.innerHTML = '<option value="all">All Employees</option>';

        (data.data || []).forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.employee_id;
            option.textContent = `${emp.full_name} (${emp.employee_id})`;
            select.appendChild(option);
        });

        // Also populate the attendance form
        const attSelect = document.getElementById('attEmployee');
        attSelect.innerHTML = '<option value="">Select an employee</option>';

        (data.data || []).forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.employee_id;
            option.textContent = `${emp.full_name} (${emp.employee_id})`;
            attSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading employees for filter:', error);
    }
}

async function handleMarkAttendance(e) {
    e.preventDefault();

    const formData = {
        employee_id: document.getElementById('attEmployee').value,
        date: document.getElementById('attDate').value,
        status: document.getElementById('attStatus').value
    };

    // Clear previous errors
    document.getElementById('attEmployeeError').textContent = '';
    document.getElementById('attDateError').textContent = '';
    document.getElementById('attStatusError').textContent = '';

    try {
        const response = await fetch(`${API_BASE}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        const messageDiv = document.getElementById('attendanceFormMessage');

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Attendance marked successfully!';
            document.getElementById('attendanceForm').reset();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('attDate').value = today;
            setTimeout(() => loadAttendanceList(), 500);
            setTimeout(() => messageDiv.textContent = '', 3000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || 'Failed to mark attendance';
        }
    } catch (error) {
        const messageDiv = document.getElementById('attendanceFormMessage');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error: ' + error.message;
    }
}

async function loadAttendanceList() {
    try {
        const response = await fetch(`${API_BASE}/attendance`);
        const data = await response.json();

        const empResponse = await fetch(`${API_BASE}/employees`);
        const empData = await empResponse.json();

        const selectedEmployee = document.getElementById('filterEmployee').value;

        const list = document.getElementById('attendanceList');

        if (data.count === 0) {
            list.innerHTML = '<div class="empty-state"><div>📅</div>No attendance records found.</div>';
            return;
        }

        // Group by employee
        const grouped = {};
        (data.data || []).forEach(record => {
            if (!grouped[record.employee_id]) {
                grouped[record.employee_id] = [];
            }
            grouped[record.employee_id].push(record);
        });

        let html = '<div class="attendance-container">';

        Object.entries(grouped).forEach(([empId, records]) => {
            if (selectedEmployee !== 'all' && selectedEmployee !== empId) {
                return;
            }

            const employee = empData.data.find(e => e.employee_id === empId);
            const present = records.filter(r => r.status === 'Present').length;
            const absent = records.filter(r => r.status === 'Absent').length;

            html += `
                <div class="attendance-group">
                    <div class="attendance-header" onclick="toggleAttendanceGroup(this)">
                        <div>
                            <div class="attendance-header-title">${employee.full_name}</div>
                            <div class="attendance-header-subtitle">${empId} • ${employee.department}</div>
                            <div class="attendance-stats">
                                <span style="color: #16a34a;">✓ ${present} Present</span>
                                <span style="color: #dc2626;">✕ ${absent} Absent</span>
                            </div>
                        </div>
                        <span>▼</span>
                    </div>
                    <div class="attendance-records" style="display: none;">
            `;

            records.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(record => {
                const date = new Date(record.date).toLocaleDateString();
                const statusClass = record.status === 'Present' ? 'status-present' : 'status-absent';
                html += `
                    <div class="attendance-record">
                        <span class="attendance-date">${date}</span>
                        <span class="status-badge ${statusClass}">${record.status}</span>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += '</div>';
        list.innerHTML = html;
    } catch (error) {
        console.error('Error loading attendance:', error);
        document.getElementById('attendanceList').innerHTML = '<div class="empty-state"><div>⚠️</div>Error loading attendance records</div>';
    }
}

function toggleAttendanceGroup(header) {
    const records = header.nextElementSibling;
    records.style.display = records.style.display === 'none' ? 'block' : 'none';
}
