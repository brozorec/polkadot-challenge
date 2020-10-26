# Hello World! by Polkadot - FRAME Development

## Node Template

- include a storage item for a custom struct
```
pub struct Book {
  book_title: Vec<u8>,
  book_author: Vec<u8>,
}
...
  Books get(fn all_books): Vec<Book>;
...
```
- added 2 dispachable functions to interact with the new storage item
```
  pub fn add_book(origin, new_book: Book) -> dispatch::DispatchResult
  pub fn remove_book(origin, book: Book) -> dispatch::DispatchResult
```
- added 2 events
```
  BookAdded(Book, AccountId),
  BookRemoved(Book, AccountId)
```

## Front-end
- added the necessary types
```
"Book": {
  "BookAuthor": "Vec<u8>",
  "BookTitle": "Vec<u8>"
}
```
- interactions with 2 dispachables

  1. [Initial](https://github.com/brozorec/polkadot-challenge/blob/master/7.%20FRAME%20Development/init.png)
  2. [Add new item](https://github.com/brozorec/polkadot-challenge/blob/master/7.%20FRAME%20Development/add.png)
  3. [Remove item](https://github.com/brozorec/polkadot-challenge/blob/master/7.%20FRAME%20Development/remove.png)
