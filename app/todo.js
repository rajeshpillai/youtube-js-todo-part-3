var todoInput = document.getElementById("todo");
var todoList = document.getElementById("todos");

var todoApp = {
    addTodo: function () {
        let todo = todoInput.value;
        let newTodo = {
            task: todo,
            status: false
        };

        todoService.addTodo(newTodo);
        this.appendElement(newTodo);

        pagination.render();
        pagination.gotoLastPage();

    },
    // Takes model->append to parent view
    appendElement: function (todo) {
        var itemView = this.parseHtml(this.getItemView(todo));
        todoList.appendChild(itemView);
    },

    // Takes html string->DOM element
    parseHtml: function (html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        return t.content.cloneNode(true);  // explain
    },


    // Get html view of single model instance.
    getItemView: function (todoItem) {
        let html = "";
        
        let btnText = "complete";
        let bntUndoRedo = "";
        let btnDelete = `
        <button type='button' 
            onclick='todoApp.removeTodo(this, ${todoItem.id})' 
        class='btn'>remove
        </button>
        `;
        
        let todoItemStyle = "";
        let buttonUndoRedoText = "complete";
        
        if (todoItem.status === true) {
            todoItemStyle = "todo-completed";
            buttonUndoRedoText = "undo";
        }
        
        // Use Backtick-> found near <esc> key on most keyboards
        btnUndoRedo = `
        <button type='button' onclick='todoApp.onToggleTodos(this, ${todoItem.id})' 
            class='btn'>${buttonUndoRedoText}
        </button>
        `;
        
        html = `
        <li id=${todoItem.id} class=${todoItemStyle}>
            ${todoItem.task} ${btnUndoRedo}${btnDelete}
        </li>
        `;
        
        if (todoItem.edit) {
            html = `
            <li id=${todoItem.id} class=${todoItemStyle}>
                <input onkeyup="todoApp.onUpdateTodo(event, ${todoItem.id})" 
                    type="text" 
                    value='${todoItem.task}' />
                ${btnUndoRedo}
                ${btnDelete}
            </li>
            `;
        }
        return html;
    },

    onToggleTodos: function (el, todoId) {
        //let todoId = el.parentNode.id; // Here 'el' is button.  The parent is the <li> element.
        let todo = todoService.toggleComplete(todoId);
        this.updateElement(el.parentNode, todo);
    },

    onUpdateTodo: function (event, todoId) {
        if (event.which == 27) {  // escape key
            this.toggleEdit(event.target.parentNode, todoId);
        } else if (event.which == 13) { //enter key
            todoService.updateTodo(todoId, event.target.value);
            this.toggleEdit(event.target.parentNode, todoId);
        }
    },
    

    // Render an updated fragment
    updateElement: function (el, todo) {
        el.outerHTML = this.getItemView(todo);
    },

    onToggleEdit: function () {
        if (event.target.tagName.toLowerCase() !== "li") return;
        let todoId = event.target.id;
        this.toggleEdit(event.target, todoId);
  
    },

    toggleEdit: function (target, todoId) {
        let todo = todoService.toggleEdit(todoId);
        this.updateElement(target, todo);
    },

    toggleTodos: function (el) {
        let todoId = el.parentNode.id;

        let todos = state.todos.map((todo) => {
            if (todo.id == todoId) {
                todo.status = !todo.status;
            }
            return todo;
        });

        state.todos = [...todos];
        this.render();
    },

    removeTodo: function (el, todoId) {
        todoService.removeTodo(todoId);
        todoApp.removeElement(el.parentNode);

        pagination.render();
        pagination.gotoLastPage();
    },

    removeElement: function (el) {
        todoList.removeChild(el);
    },

    render: function (todos) {
        let html = "";
        //let todos = todoService.getAll();

        if (todos.length === 0) {
            todoList.innerHTML = "No todos yet! Be awesome and create some todos!!";
            return;
        }
        for (let i = 0;i < todos.length; i++) {
            html += this.getItemView(todos[i]);
        }
        todoList.innerHTML = html;
    }
};

todoApp.render(todoService.getPagedData(1, pagination.pageLength));