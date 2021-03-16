class TodosModel {
    constructor() {
        this.todos = [];
    }

    async getTodos() {
        return fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((todos) => this.todos = todos);
    }

    async toogleCompleted(id) {
        const todo = this.todos.find(todo => todo.id === id);

        const newTodo = {
            ...todo,
            completed: !todo.completed
        };

        return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(newTodo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then((response) => response.json())
            .then((newTodo) => {
                this.todos = this.todos.map(todo => {
                    if (todo.id !== id) {
                        return todo;
                    }

                    return newTodo;
                });
            });
    }
    async sendPostToDoRequest(newListItem) {
        return fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "POST",
            body: JSON.stringify(newListItem),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((response) => response.json());
    }

    async sendDleteToDoRequest(id) {
        return fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: "DELETE",
        });
    }
}