$(() => {
    const controller = new TodosController();
})
class TodosController {
    constructor() {
        this.todoListView = new TodoListView({
            toggleCompleted: (id) => this.toggleCompleted(id),
            addNewTodo: (value, checked) => this.addNewTodo(value, checked),
            deleteElement: (currentItem) => this.deleteElement(currentItem),
        });
        this.todosModel = new TodosModel();

        const $app = $('.app');

        $app.append(this.todoListView.$list);

        this.init();
    }

    async init() {
        const todos = await this.todosModel.getTodos();
        this.todoListView.renderTodos(todos);
        this.todoListView.initModals();
        this.todoListView.createAddEventListener();
        this.todoListView.createSendAddEventListener()
        this.todoListView.createDeleteEventListener();
    }

    async toggleCompleted(id) {
        await this.todosModel.toogleCompleted(id);
        this.todoListView.renderTodos(this.todosModel.todos);
    }
    async addNewTodo(value, checked) {
        const newListItem = {
            userId: 0,
            id: this.todosModel.todos.length + 1,
            title: value,
            completed: checked,
        };
        await this.todosModel.sendPostToDoRequest(newListItem);
        this.todosModel.todos = [newListItem, ...this.todosModel.todos];
        this.todoListView.addNewHtmlTodo(newListItem);
    }
    async deleteElement(currentItem) {
        const id = +(currentItem.id)
        await this.todosModel.sendDleteToDoRequest(id);
        this.todosModel.todos = this.todosModel.todos.filter(todo => todo.id !== id);
    }
}
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
class TodoListView {
    constructor(config) {
        this.config = config;
        this.$list = this.generateList();
        this.$addFormElement = $('.js-add-modal');
        this.$inputFormElement = $('[name="new-text"]');
        this.$dataFormElement = $('form[name="new-data"]');
        this.$checkboxFormElement = $('[name="new-checkbox"]');
        this.$sendButtonElement = $('.js-send-btn');
        this.$addButtonElement = $('.js-add-btn');
    }

    generateList() {
        return $(`
            <ul class="list-group js-list"></ul>
        `).click((e) => this.onClickTodo(e));
    }

    generateTodo(todo) {
        const doneClass = todo.completed ? 'done' : 'not-done';

        return `
            <li data-id="${todo.id}" class="list-group-item js-item ${doneClass}">${todo.title}
                <span class = "icons">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash action js-action-delete" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </span>
            </li>
        `;
    }

    renderTodos(todos) {
        const todosHtml = todos.map(this.generateTodo);
        this.$list.html(todosHtml);
    }

    onClickTodo(e) {
        if (e.target.classList.contains("js-item")) {
            const id = $(e.target).data('id');
            this.config.toggleCompleted(id);
        }
    }

    initModals() {
        const baseModalOptions = {
            autoOpen: false,
            modal: true,
        };
        this.$addFormElement.dialog(baseModalOptions);
        return;
    }
    createAddEventListener() {
        this.$addButtonElement.on('click', () => {
            this.$addFormElement.dialog('open');
        });
    }
    createSendAddEventListener() {
        this.$sendButtonElement.on('click', () => {
            this.config.addNewTodo(this.$inputFormElement[0].value, this.$checkboxFormElement[0].checked);
            this.cleanForm();
            this.$addFormElement.dialog('close');
        })
    }
    addNewHtmlTodo(newListItem) {
        this.$list.html(this.generateTodo(newListItem) + this.$list.html());
    }
    cleanForm() {
        this.$dataFormElement[0].reset();
    }
    createDeleteEventListener() {
        this.$list.on('click', (e) => {
            if (e.target.classList.contains("js-action-delete")) {
                const currentItem = e.target.closest('li');
                this.config.deleteElement(currentItem);
                currentItem.remove();
            }
        });
    }
}