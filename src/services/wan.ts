import axios from 'axios';
import { config } from '../config';

export async function getCurrentWanIp(): Promise<string> {
  const response = await axios.get(config.wanIpService);
  return response.data.ip;
}
