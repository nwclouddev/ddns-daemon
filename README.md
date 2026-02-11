# Route53 Dynamic DNS Service

A Node.js TypeScript microservice that automatically updates AWS Route53 A records when your WAN IP changes.

## Features

- Checks WAN IP every minute
- Compares with current Route53 A record
- Updates Route53 if IP has changed
- Sends email notification on update failures

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
GATEWAY_DNS_RECORD=gateway.example.com
HOSTED_ZONE_ID=Z1234567890ABC
EMAIL_FROM=alerts@example.com
EMAIL_TO=admin@example.com
```

3. Build the project:
```bash
npm run build
```

4. Run the service:
```bash
npm start
```

## Web Interface

The service includes a Material-UI web interface showing real-time status at `http://localhost:3000`

## Development

Run backend in development mode:
```bash
npm run dev
```

Run frontend in development mode (separate terminal):
```bash
npm run dev:web
```

## AWS Permissions Required

- route53:ListResourceRecordSets
- route53:ChangeResourceRecordSets
- ses:SendEmail

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying as a systemd service on Debian/Ubuntu Linux.
