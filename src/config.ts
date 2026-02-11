import dotenv from 'dotenv';

dotenv.config();

export const config = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  route53: {
    dnsRecord: process.env.GATEWAY_DNS_RECORD!,
    hostedZoneId: process.env.HOSTED_ZONE_ID!,
  },
  email: {
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_TO!,
  },
  wanIpService: process.env.WAN_IP_SERVICE || 'https://api.ipify.org?format=json',
  webPort: parseInt(process.env.WEB_PORT || '3000', 10),
};
