#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Route53 DDNS Service Uninstaller${NC}"
echo "=================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# Configuration
SERVICE_NAME="route53-ddns"
INSTALL_DIR="/opt/${SERVICE_NAME}"
SERVICE_USER="route53-ddns"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

# Stop and disable service
if systemctl is-active --quiet "$SERVICE_NAME"; then
  echo -e "${YELLOW}Stopping service...${NC}"
  systemctl stop "$SERVICE_NAME"
fi

if systemctl is-enabled --quiet "$SERVICE_NAME" 2>/dev/null; then
  echo -e "${YELLOW}Disabling service...${NC}"
  systemctl disable "$SERVICE_NAME"
fi

# Remove service file
if [ -f "$SERVICE_FILE" ]; then
  echo -e "${YELLOW}Removing service file...${NC}"
  rm "$SERVICE_FILE"
  systemctl daemon-reload
fi

# Remove installation directory
if [ -d "$INSTALL_DIR" ]; then
  echo -e "${YELLOW}Removing installation directory...${NC}"
  rm -rf "$INSTALL_DIR"
fi

# Remove service user
if id "$SERVICE_USER" &>/dev/null; then
  echo -e "${YELLOW}Removing service user...${NC}"
  userdel "$SERVICE_USER"
fi

echo ""
echo -e "${GREEN}Uninstallation complete!${NC}"
