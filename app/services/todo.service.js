var state = {
    todos: [
        {id: 1, task: 'Get the training done!',status:true, edit: false},
        {id: 2, task: 'Ensure everyone including me understands this',status:false, edit:false},
        {id: 3, task: 'Be happy',status: false, edit: false}
    ] 
};

// Lets create some sample tasks
for(let i = 4; i <= 50; i++) {
    state.todos.push({
        id: i,
        task: "Some random task " + i,
        status: false,
        edit: false
    })
}

var todoService = {
    getAll: function () {
        return state.todos;
    },

    addTodo: function (newTodo) {
        //newTodo.id = state.todos.length + 1;  // Not a good practice to create ID
        let maxId = Math.max.apply(Math, state.todos.map((todo)=>{return todo.id}));
        newTodo.id = maxId + 1;
        state.todos = [...state.todos, newTodo];
    },

    updateTodo: function (todoId, value) {
        let todo = todoService.findTodo(todoId);
        todo.task = value; // todo: Mutating the state. Not a good practice.
    },

    findTodo: function (todoId) {
        let todo = state.todos.find((todo) => {
            return (todo.id == todoId);
        });
        return todo;
    },

    removeTodo: function (todoId) {
        let todos = state.todos.filter((todo) => {
           return todo.id != todoId;
        });
        state.todos = [...todos];
    },

    toggleEdit: function (todoId) {
        let todo = todoService.findTodo(todoId);
        todo.edit = !todo.edit;
        return todo;
    },
    
    toggleComplete: function (todoId) {
        let currentTodo;
        let todos = state.todos.map((todo) => {
            if (todo.id == todoId) {
                currentTodo = todo;
                todo.status = !todo.status;
            }
            return todo;
        });
        state.todos = [...todos];

        return currentTodo;
    },
    getTodosCount: function () {
        return state.todos.length;
    },
    getPagedData: function (pageNo, pageLength) {
        let startOfRecord = (pageNo - 1) * pageLength;
        let endOfRecord = startOfRecord + pageLength;

        let pagedData = state.todos.slice(startOfRecord, endOfRecord);
        return pagedData;
    }
};