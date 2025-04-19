---
title: Embed Version Information
---

## Linker Flags

Using linker flags, you can set the value of a variable in the code during a build. In this snippet I have a variable, `Commit`, that defaults to `unknown` but can be set during the build.

```go
package main

import "fmt"

var Commit = "unknown"

func main() {
	fmt.Println("Commit:", Commit)
}
```

If I don't pass any additional linker flags, this will just print that default value.

```bash
$ go build -o main main.go && ./main
Commit: unknown
```

To set the commit, I can add a linker flag using the output of `git rev-parse HEAD` which prints the current commit hash.

```bash
$ go build -o main -ldflags="-X main.Commit=$(git rev-parse HEAD)" main.go && ./main
Commit: 401926f4c7b8931595e58bbb181171384a78a6aa
```

Note that `main.Commit` is used because the `Commit` variable is in the `main` package. If my variable was in a different package, I would use the module's full import path + the path to the package to set the variable. If I had a module with the import path `github.com/cdevoogd/some-module` and my `Commit` variable was in a subpackage `internal/version`, my linker flag would be:

```bash
-ldflags="-X github.com/cdevoogd/some-module/internal/version.Commit=$(git rev-parse HEAD)"
```

## Go Build Information

Starting in Go 1.18, [the Go compiler can automatically embed version control information](https://go.dev/doc/go1.18#go-version). The program can use this build information at runtime to help print information about the version.

```go
package main

import (
	"fmt"
	"runtime/debug"
)

var Commit = func() string {
	buildInfo, ok := debug.ReadBuildInfo()
	if !ok {
		return "unknown (no build info)"
	}
	for _, setting := range buildInfo.Settings {
		if setting.Key == "vcs.revision" {
			return setting.Value
		}
	}
	return "unknown"
}()

func main() {
	fmt.Println("Version:", Commit)
}
```

Note that this won't work if you build a file directly. You have to build at the package level, and have Git available, for the information to get embedded. If I try and build `main.go` directly, this will not work.

```bash
$ go build -o main main.go && ./main
Version: unknown
```

If I build the entire package (even though right now it's just `main.go` anyways), it will work.

```bash
$ go build -o main . && ./main
Version: 401926f4c7b8931595e58bbb181171384a78a6aa
```

There is also more information embedded into the binary such as the commit's timestamp (`vcs.time`) and whether or not the build was performed with uncommitted changes (`vcs.modified`). To see all information embedded into a binary, you can use the `go version` command.

```bash
$ go version -m main
main: go1.21.7
	path	snippets
	mod	snippets	(devel)
	build	-buildmode=exe
	build	-compiler=gc
	build	CGO_ENABLED=1
	build	CGO_CFLAGS=
	build	CGO_CPPFLAGS=
	build	CGO_CXXFLAGS=
	build	CGO_LDFLAGS=
	build	GOARCH=arm64
	build	GOOS=darwin
	build	vcs=git
	build	vcs.revision=401926f4c7b8931595e58bbb181171384a78a6aa
	build	vcs.time=2024-02-13T02:41:39Z
	build	vcs.modified=true
```

## Handling Tarball Builds

Sometimes a project is built from source using an exported tarball. If a project is released without a build for a specific Linux distribution, for example, someone may download the source code tarball from the most recent GitHub release and build the project using that. This is problematic for the last two approaches since that tarball doesn't include any Git information. Luckily, Git provides an way for us to embed a commit in that exported source code.

Git has an attribute called [`export-subst`](https://git-scm.com/docs/gitattributes#_export_subst) that tells Git to expand placeholders in a file when adding it to an archive. In this Go file, you will see that `substitutedCommit` is set to a placeholder string.

```go
package main

import (
	"fmt"
	"strings"
)

var Commit = func() string {
	// When exported using git-archive, Git will replace this with commit information. If the
	// variable still starts with a `$` when the program was run, then the format string hasn't been
	// replaced by Git.
	substitutedCommit := "$Format:%H$"
	if strings.HasPrefix(substitutedCommit, "$") {
		return "unknown"
	}
	return substitutedCommit
}()

func main() {
	fmt.Println("Version:", Commit)
}
```

In your `.gitattributes` file, you would then set the `export-subst` attribute on the file with that variable.

```
/main.go export-subst
```

Now, when `git archive` is run that placeholder will be replaced. That command is what is run by GitHub (and many other tools) when generating an archive of the current source code. In this case, the placeholder is written so that it will be replaced by the current commit.

```bash
$ git archive HEAD | tar -x --to-stdout main.go | grep 'substitutedCommit :='
	substitutedCommit := "934e234f4116106a8e7441cdbc5d1fba92016f9a"
```

Note that this won't work when the file is not run through `git archive`. To cover multiple build scenarios, you will likely want to combine this method with one of the methods above.

```bash
$ go build -o main . && ./main
Version: unknown
```
