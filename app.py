
from flask import Flask, jsonify, request
import psycopg2

app = Flask(__name__)

conn = psycopg2.connect(
        host="localhost",
        port=5433,
        database="cloobottable",
        user='postgres',
        password='postgres')
cur = conn.cursor()

@app.route('/', methods=['GET'])
def get_info():
    cur.execute('SELECT * FROM users;')
    users = cur.fetchall()
    usersJson = []
    for i in users:
        tempObj = {
            'id': i[0],
            'task_name': i[1],
            'task_created_date': i[2],
            'task_completed': i[3]
        }
        usersJson.append(tempObj)
    return usersJson

@app.route('/getcolumn', methods=['GET'])
def get_columns():
    return {
        "column_list":[
      {"col_name":"task_id",
        "search":True,
        "sort":True,
        "filter":False,
      "type": 'String'},
        {"col_name":"task_name",
        "search":True,
        "sort":True,
        "filter":False,
        "type": 'String'},
        {"col_name":"task_created_date",
        "search":True,
        "sort":True,
        "filter":False,
        "type": 'String'},
        {
          "col_name": "task_completed",
          "search": False,
          "sort": True,
          "filter": True,
          "type": 'Boolean'
        }
    ]
    }

@app.route('/filter', methods=['GET'])
def filter():
    val = request.args.get("val")
    cur.execute('SELECT * FROM users WHERE task_completed=%s;', [val])
    users = cur.fetchall()
    usersJson = []
    for i in users:
        tempObj = {
            'id': i[0],
            'task_name': i[1],
            'task_created_date': i[2],
            'task_completed': i[3]
        }
        usersJson.append(tempObj)
    return usersJson

@app.route('/search', methods=['GET'])
def search():
    attr = request.args.get('attr')
    val = request.args.get('val')
    if attr == 'task_name':
        cur.execute("SELECT * FROM users WHERE task_name=%s;", [val])
    elif attr == 'task_id':
         cur.execute("SELECT * FROM users WHERE id=%s;", [val])
    elif attr == 'task_created_date':
         cur.execute("SELECT * FROM users WHERE task_created_id=%s;", [val])
    users = cur.fetchall()
    print(users)
    usersJson = []
    for i in users:
        tempObj = {
            'id': i[0],
            'task_name': i[1],
            'task_created_date': i[2],
            'task_completed': i[3]
        }
        usersJson.append(tempObj)
    return usersJson

@app.route('/sort', methods=['GET'])
def sort():
    attr = request.args.get('attr')
    order = request.args.get('order')
    print(attr, order)
    if attr == 'task_name':
        if order == 'ASC':
            cur.execute("SELECT * FROM users ORDER BY task_name ASC;")
        else:
            cur.execute("SELECT * FROM users ORDER BY task_name DESC;")
    elif attr == 'task_id':
         if order == 'ASC':
            cur.execute("SELECT * FROM users ORDER BY id ASC;")
         else:
            cur.execute("SELECT * FROM users ORDER BY id DESC;")
    elif attr == 'task_created_date':
         if order == 'ASC':
            cur.execute("SELECT * FROM users ORDER BY task_created_id ASC;")
         else:
            cur.execute("SELECT * FROM users ORDER BY task_created_id DESC;")
    else:
        if order == 'ASC':
            cur.execute("SELECT * FROM users ORDER BY task_completed ASC;")
        else:
            cur.execute("SELECT * FROM users ORDER BY task_completed DESC;")
    users = cur.fetchall()
    print(users)
    usersJson = []
    for i in users:
        tempObj = {
            'id': i[0],
            'task_name': i[1],
            'task_created_date': i[2],
            'task_completed': i[3]
        }
        usersJson.append(tempObj)
    return usersJson

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)