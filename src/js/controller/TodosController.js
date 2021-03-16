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