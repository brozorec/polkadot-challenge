import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair, action } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');

  const [lastBookAdded, setLastBookAdded] = useState({ title: '', author: '' });

  useEffect(() => {
    let unsubscribe;
    api.query.templateModule.books(books => {
      if (books.length > 0) {
        const last = books[0];

        setLastBookAdded({
          author: last.BookAuthor.toHuman(),
          title: last.BookTitle.toHuman()
        });
      } else {
        setLastBookAdded({ author: '', title: '' });
      }
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column width={8}>
      <h1>{ action === 'add' ? 'Add Book' : 'Remove Book' }</h1>
      { action === 'add'
        ? <Card centered>
          <Card.Content textAlign='center'>
            <Statistic label='Last book added' />
            <Card.Header content={lastBookAdded.title} />
            <Card.Description content={lastBookAdded.author} />
          </Card.Content>
        </Card>
        : null
      }
      <Form>
        <Form.Field>
          <Input
            label='Book Tittle'
            state='bookTitle'
            type='text'
            onChange={(_, { value }) => setBookTitle(value)}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label='Book Author'
            state='bookAuthor'
            type='text'
            onChange={(_, { value }) => setBookAuthor(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label={action === 'add' ? 'Add new book' : 'Remove book'}
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: `${action}Book`,
              inputParams: [{ BookTitle: bookTitle, BookAuthor: bookAuthor }],
              paramFields: [true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function BookStore (props) {
  const { api } = useSubstrate();
  return (api.query.templateModule ? <Main {...props} /> : null);
}
