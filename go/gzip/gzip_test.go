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
