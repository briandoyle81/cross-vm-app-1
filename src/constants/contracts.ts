import ClickTokenTestnet from '../contracts/testnet/ClickTokenModule#ClickToken.json';
import ClickTokenMainnet from '../contracts/mainnet/ClickTokenModule#ClickToken.json';
import deployedAddressesTestnet from '../contracts/testnet/deployed_addresses.json';
import deployedAddressesMainnet from '../contracts/mainnet/deployed_addresses.json';

export function getClickToken(network: 'mainnet' | 'testnet' = 'testnet') {
  if (network === 'mainnet') {
    return {
      abi: ClickTokenMainnet.abi,
      address: deployedAddressesMainnet['ClickTokenModule#ClickToken'] as `0x${string}`,
    };
  }
  return {
    abi: ClickTokenTestnet.abi,
    address: deployedAddressesTestnet['ClickTokenModule#ClickToken'] as `0x${string}`,
  };
} 