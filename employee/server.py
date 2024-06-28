from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('employees.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            position TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add', methods=['POST'])
def add_employee():
    data = request.get_json()
    name = data['name']
    position = data['position']
    
    conn = get_db_connection()
    conn.execute('INSERT INTO employees (name, position) VALUES (?, ?)', (name, position))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/update', methods=['POST'])
def update_employee():
    data = request.get_json()
    employee_id = data['id']
    name = data['name']
    position = data['position']
    
    conn = get_db_connection()
    conn.execute('UPDATE employees SET name = ?, position = ? WHERE id = ?', (name, position, employee_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_employee(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM employees WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/employees', methods=['GET'])
def get_employees():
    conn = get_db_connection()
    employees = conn.execute('SELECT * FROM employees').fetchall()
    conn.close()
    
    employee_list = []
    for employee in employees:
        employee_list.append({'id': employee['id'], 'name': employee['name'], 'position': employee['position']})
    
    return jsonify({'employees': employee_list})

if __name__ == '__main__':
    app.run(debug=True)
