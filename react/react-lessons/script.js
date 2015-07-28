var counter = (function counter() {
    var internal = 0;
    return function () {
        return internal++;
    }
})();

var TodoItem = React.createClass({
    getInitialState: function () {
        return {
            isNew: true
        };
    },
    render: function () {
        return (
            <li
                style={{textDecoration: this.props.item.done?'line-through':'', backgroundColor: this.state.isNew?'green':'yellow'}}>
                <input type="checkbox" checked={this.props.item.done}
                       onChange={this.props.handleCheckbox}/>{this.props.item.name}</li>
        )
    },
    componentDidMount: function () {
        this.myTimer = setTimeout(function () {
            this.setState({
                isNew: false
            });
        }.bind(this), 5000);
    },

    componentWillUnmount: function () {
        clearTimeout(this.myTimer);
    }
});

var TodoList = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function () {
        return {
            todos: [{id: counter(), name: 'first', done: false}, {id: counter(), name: 'second', done: false}],
            currentInput: null
        }
    },
    addTodo: function () {
        var newTodo = {
            id: counter(),
            name: this.state.currentInput,
            done: false
        };
        this.setState(
            {
                todos: this.state.todos.concat(newTodo),
                currentInput: null
            });
    },
    handleCheckbox: function (id) {

        var todosCopy = _.map(this.state.todos, function (todo) {
            if (todo.id === id) {
                todo = _.clone(todo);
                todo.done = !todo.done
            }
            return todo;
        });
        this.setState(
            {
                todos: todosCopy
            }
        )

    },
    clearDone: function () {
        var newTodos = _.filter(this.state.todos, function (todo) {
            return !todo.done;
        });
        this.setState({
            todos: newTodos
        })
    },
    render: function () {
        return <div>
            {_.map(this.state.todos, function (item) {
                return <TodoItem handleCheckbox={this.handleCheckbox.bind(this, item.id)} item={item} key={item.id}/>;
            }, this)}
            <input valueLink={this.linkState('currentInput')}/>
            <button onClick={this.addTodo}>Add</button>
            <button onClick={this.clearDone}>Clear done</button>
        </div>
    }

});

React.render(<TodoList/>,
    document.getElementById('container'));