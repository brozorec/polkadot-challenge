use crate::{Error, mock::*, RawEvent, Book};
use frame_support::{assert_ok, assert_noop};

#[test]
fn it_works_for_new_value() {
	new_test_ext().execute_with(|| {
        let new_book = Book {
            book_title: Vec::from("Title"),
            book_author: Vec::from("Author")
        };

		assert_ok!(BookStoreModule::add_book(Origin::signed(1), new_book.clone()));
        assert_eq!(BookStoreModule::all_books()[0], new_book);

        let expected_event = TestEvent::book_store(RawEvent::BookAdded(new_book, 1));

        assert_eq!(System::events()[0].event, expected_event);
	});
}

//#[test]
//fn correct_error_for_none_value() {
	//new_test_ext().execute_with(|| {
		//assert_noop!(
			//BookStoreModule::cause_error(Origin::signed(1)),
			//Error::<Test>::NoneValue
		//);
	//});
//}
