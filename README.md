# IoT Client Application
**React.js IoT client application capable of interfacing with multiple platforms.**

## Tasks
- `npm start` - starts the hot-reloaded dev server.
- `npm build` - builds the production version in "dist" folder.
- `npm server` - serves the production version from the "dist" folder.
- `npm lint` - lints the codebase for errors.

## Setting up pm2
You can use pm2 to serve the production version in your server.
- `npm i -g pm2` - installs pm2 globally.
- `pm2 install pm2-logrotate` - installs pm2 logrotate.
- `pm2 set pm2-logrotate:max_size 10M` - configure logrotate max size.
- `pm2 set pm2-logrotate:retain 7` - configure logrotate retention.
- `pm2 set pm2-logrotate:interval_unit DD` - configure logrotate interval.
- `pm2 start scripts/server.js --name iot --interpreter ./node_modules/.bin/babel-node -- 8080` - start the server on port 8080.
- `pm2 save` - save the config to persist restarts etc.

### PM2 helpful commands
- `pm2 list`
- `pm2 show server`
- `pm2 monit`
- `pm2 logs`
- `pm2 logs --out --lines 20 --timestamp`
- `pm2 stop server`
- `pm2 restart server`
- `pm2 delete server`

## Setup haproxy
- `yum install -y haproxy`
- `vi /etc/haproxy/haproxy.cfg`

```
...other settings...
#---------------------------------------------------------------------
# main frontend which proxys to the backends
#---------------------------------------------------------------------
frontend http-in
    bind *:80

    # define hosts
    acl host-iot hdr(host) -i iot.stagnationlab.com

    # figure out which one to use
    use_backend iot-backend if host-iot
    default_backend iot-backend

#---------------------------------------------------------------------
# backends
#---------------------------------------------------------------------
backend iot-backend
    server web-1 127.0.0.1:8080 check
```
