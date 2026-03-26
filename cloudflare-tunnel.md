# Cloudflare Tunnel Setup for GroupsGuru

## Prerequisites
- Domain: groupsguru.in configured on Cloudflare DNS
- cloudflared installed: winget install cloudflare.cloudflared

## Steps
1. cloudflared tunnel login
2. cloudflared tunnel create groupsguru
3. Create config.yml (see below)
4. cloudflared tunnel route dns groupsguru groupsguru.in
5. cloudflared tunnel run groupsguru

## config.yml
tunnel: c8d3f738-4387-4f2f-b973-ece05dddedb7
credentials-file: C:\Users\jayar\.cloudflared\c8d3f738-4387-4f2f-b973-ece05dddedb7.json

ingress:
  - hostname: groupsguru.in
    path: /api
    service: http://localhost:8080
  - hostname: groupsguru.in
    service: http://localhost:3000
  - hostname: api.groupsguru.in
    service: http://localhost:8080
  - service: http_status:404

## DNS Setup
1. cloudflared tunnel route dns groupsguru groupsguru.in
2. cloudflared tunnel route dns groupsguru api.groupsguru.in

