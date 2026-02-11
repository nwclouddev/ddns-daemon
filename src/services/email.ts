import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { config } from '../config';

const client = new SESClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export async function sendFailureEmail(error: string): Promise<void> {
  const command = new SendEmailCommand({
    Source: config.email.from,
    Destination: {
      ToAddresses: [config.email.to],
    },
    Message: {
      Subject: {
        Data: `Route53 DDNS Update Failed for ${config.route53.dnsRecord}`,
      },
      Body: {
        Text: {
          Data: `Failed to update DNS record ${config.route53.dnsRecord}.\n\nError: ${error}\n\nTimestamp: ${new Date().toISOString()}`,
        },
      },
    },
  });

  await client.send(command);
}
