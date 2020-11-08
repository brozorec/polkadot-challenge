import React, { useState } from 'react';
import { Form, Input, Grid, Label, Icon, Button, Divider } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { sortAddresses } from '@polkadot/api';

export default function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  const [status, setStatus] = useState(null);
  const [signatories, setSignatories] = useState('');
  const [formState, setFormState] = useState({ addressTo: '', amount: 0, multisigAddr: '' });

  const onChangeSig = (_, data) => {
    setSignatories(data.value.split(','));
  };

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const onTransaction = async () => {
    const tx = await api.tx.balances.transfer(addressTo, amount);

    const timepoint = await api.query.multisig.multisigs(multisigAddr, tx.method.hash);
    if (timepoint.isSome) {
      api.tx.multisig.asMulti(2, signatories, timepoint.unwrap().when, tx.method.toHex(), false, 100000000000)
        .signAndSend(accountPair, ({ status }) => {
          status.isFinalized
            ? setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
            : setStatus(`Current transaction status: ${status.type}`);
        });
    }
  };

  const { addressTo, amount, multisigAddr } = formState;

  return (
    <Grid.Column width={8}>
      <h1>Final Transaction</h1>
      <Form>
        <Form.Field>
          <Label basic color='teal'>
            <Icon name='hand point right' />
            1 Unit = 1000000000000000
          </Label>
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
        <Form.Field>
          <Input
            fluid
            label='Multisig Address'
            type='text'
            placeholder='address'
            state='multisigAddr'
            onChange={onChange}
          />
        </Form.Field>
        <Divider horizontal>Transfer to execute</Divider>
        <Form.Field>
          <Input
            fluid
            label='To'
            type='text'
            placeholder='address'
            state='addressTo'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Amount'
            type='number'
            state='amount'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <Button
            basic
            type='submit'
            onClick={onTransaction}
          >
            Submit
          </Button>
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

