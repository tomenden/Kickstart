(function () {
    'use strict';

    var Quiz = React.createClass({displayName: "Quiz",
        propTypes: {
            books: React.PropTypes.array.isRequired
        },
        render: function () {
            return (
                React.createElement("div", null, 
                    _.map(this.props.books, function (book) {
                        return React.createElement(Book, {title: book});
                    })
                )
            );
        }
    });

    var Book = React.createClass({displayName: "Book",
        propTypes: {
            title: React.PropTypes.string.isRequired
        },
        render: function () {
            return (
                React.createElement("div", null, 
                    React.createElement("h4", null, this.props.title)
                )
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
    React.render(React.createElement(Quiz, {books: ['The Lord of The Rings', 'Three Musketeers']}),
        document.getElementById('app'));

}());