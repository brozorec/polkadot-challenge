import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';

export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [signatories, setSignatories] = useState(null);

  const { accountPair } = props;

  const onChangeHash = (_, data) => setTxHash(data.value);
  const onChangeSig = (_, data) => {
    setSignatories(data.value.split(','));
  };

  return (
    <Grid.Column width={8}>
      <h1>Initial Transaction</h1>
      <Form>
        <Form.Field>
          <Input
            fluid
            label='Transaction Hash'
            type='text'
            placeholder='hash'
            onChange={onChangeHash}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Other Signatories'
            type='text'
            placeholder='comma separated sorted addresses'
            onChange={onChangeSig}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Submit'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'multisig',
              callable: 'approveAsMulti',
              inputParams: [2, signatories, null, txHash, 100000000000],
              paramFields: [true, true, { optional: true }, true, true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
