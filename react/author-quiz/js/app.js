(function () {
    'use strict';

    var Quiz = React.createClass({
        propTypes: {
            data: React.PropTypes.array.isRequired
        },
        getInitialState: function () {
            return _.assign({
                bgClass: 'neutral',
                showContinue: false
            }, this.props.data.selectGame());
        },
        handleBookSelected: function (title) {
            var isCorrect = this.state.checkAnswer(title);
            this.setState({
                bgClass: isCorrect ? 'pass' : 'fail',
                showContinue: isCorrect
            });
        },
        handleContinue: function () {
            this.setState(this.getInitialState());
        },
        handleAddGame: function () {
            routie('add');
        },
        render: function () {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-4">
                            <img src={this.state.author.imageUrl} className="authorimage col-md-3"/>
                        </div>
                        <div className="col-md-7">
                            {_.map(this.state.books, function (book) {
                                return <Book onBookSelected={this.handleBookSelected} title={book}/>;
                            }, this)}
                        </div>
                        <div className={"col-md-1 " + this.state.bgClass}></div>
                    </div>

                    {this.state.showContinue ? (
                        <div className="row">
                            <div className="col-md-12">
                                <input onClick={this.handleContinue} type="button"
                                       className="btn btn-primary btn-lg pull-right" value="Continue"/>
                            </div>
                        </div>) : <span/>}

                    <div className="row">
                        <div className="row-col-md-12">
                            <input onClick={this.handleAddGame} id="addGameButton" type="button" value="Add Game"
                                   class="btn"/>
                        </div>
                    </div>

                </div>
            );
        }
    });

    var Book = React.createClass({
        propTypes: {
            title: React.PropTypes.string.isRequired
        },
        handleClick: function () {
            this.props.onBookSelected(this.props.title);
        },
        render: function () {
            return (
                <div onClick={this.handleClick} className="answer">
                    <h4>{this.props.title}</h4>
                </div>
            );
        }
    });

    var AddGameForm = React.createClass({
        propTypes: {
            onGameFormSubmitted: React.PropTypes.func.isRequired
        },
        handleSubmit: function () {
            var data = getRefs(this);
            this.props.onGameFormSubmitted(getRefs(this));
        },
        render: function () {
            return (
                <div className="row">
                    <div className="col-md-12">
                        <h1>Add Game</h1>

                        <form role="form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <input ref="imageUrl" type="text" className="form-control" placeholder="Image Url"/>
                            </div>
                            <div className="form-group">
                                <input ref="answer1" type="text" className="form-control" placeholder="Answer 1"/>
                            </div>
                            <div className="form-group">
                                <input ref="answer2" type="text" className="form-control" placeholder="Answer 2"/>
                            </div>
                            <div className="form-group">
                                <input ref="answer3" type="text" className="form-control" placeholder="Answer 3"/>
                            </div>
                            <div className="form-group">
                                <input ref="answer4" type="text" className="form-control" placeholder="Answer 4"/>
                            </div>
                            <button type="submit" className="btn btn-default">Submit</button>
                        </form>
                    </div>
                </div>
            );

        }
    });


    var data = [
        {
            name: 'Mark Twain',
            imageUrl: 'images/authors/marktwain.jpg',
            books: ['The Adventures of Huckleberry Finn']
        },
        {
            name: 'Joseph Conrad',
            imageUrl: 'images/authors/josephconrad.png',
            books: ['Heart of Darkness']
        },
        {
            name: 'J.K. Rowling',
            imageUrl: 'images/authors/jkrowling.jpg',
            imageSource: 'Wikimedia Commons',
            imageAttribution: 'Daniel Ogren',
            books: ['Harry Potter and the Sorcerers Stone']
        },
        {
            name: 'Stephen King',
            imageUrl: 'images/authors/stephenking.jpg',
            imageSource: 'Wikimedia Commons',
            imageAttribution: 'Pinguino',
            books: ['The Shining', 'IT']
        },
        {
            name: 'Charles Dickens',
            imageUrl: 'images/authors/charlesdickens.jpg',
            imageSource: 'Wikimedia Commons',
            books: ['David Copperfield', 'A Tale of Two Cities']
        },
        {
            name: 'William Shakespeare',
            imageUrl: 'images/authors/williamshakespeare.jpg',
            imageSource: 'Wikimedia Commons',
            books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
        }
    ];

    function selectGame() {
        var books = _(this).pluck('books')
            .flatten()
            .shuffle().value()
            .slice(0, 4);

        var answer = books[_.random(0, books.length - 1)];

        return {
            books: books,
            author: _.find(this, function (author) {
                return _.includes(author.books, answer);
            }),
            checkAnswer: function (title) {
                return _.includes(this.author.books, title);
            }
        }
    }

    data.selectGame = selectGame;

    data.checkAnswer = function (title) {
        return _.includes(this.author.books, title);
    };

    routie({
        '': function () {
            React.render(<Quiz data={data}/>,
                document.getElementById('app'));

        },
        'add': function () {
            React.render(
                <AddGameForm onGameFormSubmitted={handleAddGameFormSubmitted}/>,
                document.getElementById('app'));
        }
    });

    function handleAddGameFormSubmitted(data) {
        var quizData = [{
            imageUrl: data.imageUrl,
            books: [data.answer1, data.answer2, data.answer3, data.answer4]
        }];
        quizData.selectGame = selectGame;
        React.render(<Quiz data={quizData}/>,
            document.getElementById('app'));

    }

    function getRefs(component) {
        var result = {};
        Object.keys(component.refs).forEach(function (refName) {
            result[refName] = React.findDOMNode(component.refs[refName]).value;
        });
        return result;
    }

}());