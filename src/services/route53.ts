import { Route53Client, ListResourceRecordSetsCommand, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53';
import { config } from '../config';

const client = new Route53Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export async function getCurrentARecord(): Promise<string | null> {
  const command = new ListResourceRecordSetsCommand({
    HostedZoneId: config.route53.hostedZoneId,
    StartRecordName: config.route53.dnsRecord,
    StartRecordType: 'A',
    MaxItems: 1,
  });

  const response = await client.send(command);
  const record = response.ResourceRecordSets?.find(
    (r) => r.Name === `${config.route53.dnsRecord}.` && r.Type === 'A'
  );

  return record?.ResourceRecords?.[0]?.Value || null;
}

export async function updateARecord(newIp: string): Promise<void> {
  const command = new ChangeResourceRecordSetsCommand({
    HostedZoneId: config.route53.hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: config.route53.dnsRecord,
            Type: 'A',
            TTL: 300,
            ResourceRecords: [{ Value: newIp }],
          },
        },
      ],
    },
  });

  await client.send(command);
}
