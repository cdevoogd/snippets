package tar

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/require"
)

func tempFile(t *testing.T, path, data string) string {
	t.Helper()
	err := os.WriteFile(path, []byte(data), 0600)
	require.NoError(t, err)
	require.FileExists(t, path)
	return path
}

func TestArchiveFiles(t *testing.T) {
	dir := t.TempDir()
	fileA := tempFile(t, filepath.Join(dir, "a.txt"), "alpha")
	fileB := tempFile(t, filepath.Join(dir, "b.txt"), "bravo")
	fileC := tempFile(t, filepath.Join(dir, "c.txt"), "charlie")
	archiveFile := filepath.Join(dir, "files.tar")

	files := []string{fileA, fileB, fileC}
	err := ArchiveFiles(files, archiveFile)
	require.NoError(t, err)
	require.FileExists(t, archiveFile)
}
