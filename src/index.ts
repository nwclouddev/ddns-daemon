import { getCurrentARecord, updateARecord } from './services/route53';
import { getCurrentWanIp } from './services/wan';
import { sendFailureEmail } from './services/email';
import { state } from './state';
import { startWebServer } from './web/server';

async function checkAndUpdate() {
  try {
    console.log(`[${new Date().toISOString()}] Checking DNS record...`);
    state.lastCheck = new Date().toISOString();

    const [currentDnsIp, currentWanIp] = await Promise.all([
      getCurrentARecord(),
      getCurrentWanIp(),
    ]);

    state.currentDnsIp = currentDnsIp;
    state.currentWanIp = currentWanIp;

    console.log(`DNS IP: ${currentDnsIp}, WAN IP: ${currentWanIp}`);

    if (currentDnsIp !== currentWanIp) {
      console.log('IP mismatch detected. Updating Route53...');
      
      try {
        await updateARecord(currentWanIp);
        state.lastUpdate = new Date().toISOString();
        state.updateCount++;
        state.lastError = null;
        console.log(`Successfully updated DNS record to ${currentWanIp}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        state.lastError = errorMsg;
        console.error('Failed to update DNS record:', errorMsg);
        await sendFailureEmail(errorMsg);
      }
    } else {
      console.log('IP addresses match. No update needed.');
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    state.lastError = errorMsg;
    console.error('Error during check:', errorMsg);
  }
}

// Start web server
startWebServer();

// Run immediately on start
checkAndUpdate();

// Run every minute
setInterval(checkAndUpdate, 60000);

console.log('Route53 DDNS service started. Checking every minute...');
