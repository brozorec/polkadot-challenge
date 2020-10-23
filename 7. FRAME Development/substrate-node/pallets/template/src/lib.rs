#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// https://substrate.dev/docs/en/knowledgebase/runtime/frame
use frame_support::{
    decl_module,
    decl_storage,
    decl_event,
    decl_error,
    dispatch,
    traits::Get,
    codec::{Decode, Encode},
};
use frame_system::ensure_signed;
use sp_std::prelude::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

// Configure the pallet by specifying the parameters and types on which it depends.
pub trait Trait: frame_system::Trait {
	// Because this pallet emits events, it depends on the runtime's definition of an event.
	type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
}


#[derive(Encode, Decode, Clone, Default, Debug, PartialEq, Eq, Ord, PartialOrd)]
pub struct Book {
    book_title: Vec<u8>,
    book_author: Vec<u8>,
}

// The pallet's runtime storage items.
// https://substrate.dev/docs/en/knowledgebase/runtime/storage
decl_storage! {
	// A unique name is used to ensure that the pallet's storage items are isolated.
	// This name may be updated, but each pallet in the runtime must use a unique name.
	// ---------------------------------vvvvvvvvvvvvvv
	trait Store for Module<T: Trait> as BookStoreModule {
		// Learn more about declaring storage items:
		// https://substrate.dev/docs/en/knowledgebase/runtime/storage#declaring-storage-items
        //BookByAuthor get(fn book_by_author): Option<Book>;
        //BookByTitle get(fn book_by_title): Option<Book>;
        Books get(fn all_books): Vec<Book>;
	}
}

// Pallets use events to inform users when important changes are made.
// https://substrate.dev/docs/en/knowledgebase/runtime/events
decl_event!(
	pub enum Event<T> where AccountId = <T as frame_system::Trait>::AccountId {
		/// Event documentation should end with an array that provides descriptive names for event
		/// parameters. [something, who]
		BookAdded(Book, AccountId),
        BookRemoved(Book, AccountId),
	}
);

// Errors inform users that something went wrong.
decl_error! {
	pub enum Error for Module<T: Trait> {
        AlreadyAdded,
        NotFound
	}
}

// Dispatchable functions allows users to interact with the pallet and invoke state changes.
// These functions materialize as "extrinsics", which are often compared to transactions.
// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		// Errors must be initialized if they are used by the pallet.
		type Error = Error<T>;

		// Events must be initialized if they are used by the pallet.
		fn deposit_event() = default;

		#[weight = 10_000 + T::DbWeight::get().writes(1)]
        pub fn add_book(origin, new_book: Book) -> dispatch::DispatchResult {

            let who = ensure_signed(origin)?;

            let mut books = <Books>::get().clone();

            match books.binary_search(&new_book) {
                Ok(_) => Err(Error::<T>::AlreadyAdded.into()),
                Err(index) => {
                    books.insert(index, new_book.clone());
                    <Books>::put(books);
                    Self::deposit_event(RawEvent::BookAdded(new_book, who));
                    Ok(())
                }
            }
        }

		#[weight = 10_000 + T::DbWeight::get().writes(1)]
        pub fn remove_book(origin, book: Book) -> dispatch::DispatchResult {

            let who = ensure_signed(origin)?;

            let mut books = <Books>::get();

            match books.binary_search(&book) {
                Ok(index) => {
                    books.remove(index);
                    <Books>::put(books);
                    Self::deposit_event(RawEvent::BookRemoved(book, who));
                    Ok(())
                },
                Err(_) => Err(Error::<T>::NotFound.into())
            }
        }
	}
}
