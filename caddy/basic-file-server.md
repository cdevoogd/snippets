## Basic File Server

[Caddy](https://caddyserver.com/) can be used to quickly set up a basic HTTP(S) file server. Below is an example of a basic file server setup that can be used in your Caddyfile. This example makes use of [Caddy's file_server directive](https://caddyserver.com/docs/caddyfile/directives/file_server).

```caddyfile
# For requests on port 8080
:8080 {
    # Host the file server at path '/files*'
    handle_path /files* {
        root * /files         # Location where Caddy should look for the files for all paths
        file_server browse {  # Host a file server with browsing enabled
            hide .* _*        # Hide files starting with a '.' and '_'
        }
    }

    # If another path is requested that isn't /files return 404
    handle {
        respond "Not Found" 404
    }
}
```
