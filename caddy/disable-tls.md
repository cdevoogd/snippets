## Disabling TLS

By default, Caddy will attempt to automatically set up TLS and HTTPS. When attempting to initially set up a server, however, you may want this disabled.

References:
- [Caddyfile Ooptions](https://caddyserver.com/docs/caddyfile/options)
- [Caddy: Automatic HTTPS](https://caddyserver.com/docs/automatic-https)

```caddyfile
# You can have one global options block per Caddyfile.
{
    # 'off' will disable HTTPS entirely (no cert management or redirects)
    # 'disable_redirects' will disable only HTTP->HTTPS redirects
    # 'disable_certs' will disable only certificate automation
    # 'ignore_loaded_certs' will automate certificates even for names which appear on
    # manually-loaded certs
    auto_https off
}
```
