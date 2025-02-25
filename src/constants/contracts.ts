import ClickToken from '../contracts/ClickTokenModule#ClickToken.json';
import deployedAddresses from '../contracts/deployed_addresses.json';

export const clickToken = {
  abi: ClickToken.abi,
  address: deployedAddresses['ClickTokenModule#ClickToken'] as `0x${string}`
}; 