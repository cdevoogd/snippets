## Gzip Compression and Decompression

```go
package gzip

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"os"
)

func Compress(input io.Reader, output io.Writer) error {
	zipper := gzip.NewWriter(output)
	defer zipper.Close()

	_, err := io.Copy(zipper, input)
	if err != nil {
		return fmt.Errorf("error compressing data: %w", err)
	}

	// Calling Close() is required for the footer to be properly written. If you don't call it, you
	// will end up getting 'unexpected EOF' errors when you try and decompress the data.
	err = zipper.Close()
	if err != nil {
		return fmt.Errorf("error flushing compressed bytes: %w", err)
	}

	return nil
}

func CompressFile(infile, outfile string) error {
	in, err := os.Open(infile)
	if err != nil {
		return fmt.Errorf("error opening input file: %w", err)
	}

	out, err := os.Create(outfile)
	if err != nil {
		return fmt.Errorf("error creating output file: %w", err)
	}

	return Compress(in, out)
}

func CompressString(s string) ([]byte, error) {
	in := bytes.NewReader([]byte(s))
	out := &bytes.Buffer{}

	err := Compress(in, out)
	if err != nil {
		return nil, err
	}

	return out.Bytes(), nil
}

func Decompress(input io.Reader, output io.Writer) error {
	decompressor, err := gzip.NewReader(input)
	if err != nil {
		return fmt.Errorf("error creating gzip reader: %w", err)
	}
	defer decompressor.Close()

	_, err = io.Copy(output, decompressor)
	if err != nil {
		return fmt.Errorf("error copying decompressed bytes to buffer: %w", err)
	}

	return nil
}

func DecompressFile(infile, outfile string) error {
	in, err := os.Open(infile)
	if err != nil {
		return fmt.Errorf("error opening input file: %w", err)
	}

	out, err := os.Create(outfile)
	if err != nil {
		return fmt.Errorf("error creating output file: %w", err)
	}

	return Decompress(in, out)
}

func DecompressToString(in []byte) (string, error) {
	input := bytes.NewReader(in)
	output := &bytes.Buffer{}

	err := Decompress(input, output)
	if err != nil {
		return "", fmt.Errorf("decompression error: %w", err)
	}

	return output.String(), nil
}
```

Here are some unit tests for the code above that help display how it might be used

```go
package gzip

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestCompressAndDecompress(t *testing.T) {
	const startingData = "Hello, world!"

	t.Run("string compress and decompress", func(t *testing.T) {
		compressed, err := CompressString(startingData)
		require.NoError(t, err)
		require.NotNil(t, compressed)

		decompressed, err := DecompressToString(compressed)
		require.NoError(t, err)
		require.Equal(t, startingData, decompressed)
	})

	t.Run("file compress and decompress", func(t *testing.T) {
		dir := t.TempDir()
		startFile := filepath.Join(dir, "data.txt")
		compressedFile := filepath.Join(dir, "data.txt.gz")
		decompressedFile := filepath.Join(dir, "decompressed.txt")

		err := os.WriteFile(startFile, []byte(startingData), os.ModePerm)
		require.NoError(t, err)

		err = CompressFile(startFile, compressedFile)
		require.NoError(t, err)
		require.FileExists(t, compressedFile)

		err = DecompressFile(compressedFile, decompressedFile)
		require.NoError(t, err)
		require.FileExists(t, decompressedFile)

		startData, err := os.ReadFile(startFile)
		require.NoError(t, err)
		endData, err := os.ReadFile(decompressedFile)
		require.NoError(t, err)
		require.Equal(t, startData, endData)
	})
}
```
