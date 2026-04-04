import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Wallet from './components/Wallet';
import BuyTicket from './components/BuyTicket';
import Balance from './components/Balance';

// Mock freighter-api
vi.mock('@stellar/freighter-api', () => ({
  isAllowed: vi.fn(),
  setAllowed: vi.fn(),
  getUserInfo: vi.fn(),
  signTransaction: vi.fn()
}));

// Mock sdk
vi.mock('@stellar/stellar-sdk', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    rpc: {
      Server: vi.fn().mockImplementation(() => ({
        getAccount: vi.fn().mockResolvedValue({ id: 'GTEST' }),
        sendTransaction: vi.fn().mockResolvedValue({ status: 'PENDING', hash: 'fake_hash' }),
        getTransaction: vi.fn().mockResolvedValue({ status: 'SUCCESS' })
      })),
      TransactionBuilder: {
         fromXDR: vi.fn().mockReturnValue({})
      }
    },
    Contract: vi.fn().mockImplementation(() => ({
      call: vi.fn()
    })),
    TransactionBuilder: vi.fn().mockImplementation(() => ({
      addOperation: vi.fn().mockReturnThis(),
      setTimeout: vi.fn().mockReturnThis(),
      build: vi.fn().mockReturnValue({ toXDR: () => 'xdr' })
    })),
    Horizon: {
      Server: vi.fn().mockImplementation(() => ({
        loadAccount: vi.fn().mockResolvedValue({
          balances: [{ asset_type: 'native', balance: '10.00' }]
        })
      }))
    }
  };
});

describe('Wallet State Management', () => {
  it('shows connect button when tracking no pubkey installed', () => {
    // mock window.freighter
    window.freighter = true;
    render(<Wallet pubKey="" setPubKey={() => {}} setAlert={() => {}} />);
    expect(screen.getByText(/Connect Freighter/i)).to.exist;
  });

  it('shows disconnect and pubkey when connected', () => {
    render(<Wallet pubKey="GABCD123456789" setPubKey={() => {}} setAlert={() => {}} />);
    expect(screen.getByText(/Disconnect/i)).to.exist;
    expect(screen.getByText(/GABCD1...3456789/i)).to.exist;
  });
});

describe('Balance Fetch', () => {
  it('fetches and displays balance properly', async () => {
    render(<Balance pubKey="GTEST" refreshTrigger={0} setAlert={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText(/10.00 XLM/i)).to.exist;
    });
  });
});

describe('Transaction Build and buy_ticket', () => {
  it('builds transaction', async () => {
    // Set env var mock
    import.meta.env.VITE_CONTRACT_ID = "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    const onSuccess = vi.fn();
    render(<BuyTicket pubKey="GTEST" setAlert={() => {}} onSuccess={onSuccess} />);
    
    // Check elements
    const button = screen.getByText(/Buy Ticket/i);
    fireEvent.click(button);

    await waitFor(() => {
       // Assuming it goes to success state and calls onSuccess
       expect(onSuccess).toHaveBeenCalled();
       expect(screen.getByText(/Success Hash/i)).to.exist;
    });
  });
});
