package tar

import (
	"archive/tar"
	"bytes"
	"fmt"
	"io"
	"os"
)

func ArchiveFiles(files []string, outfile string) error {
	var buffer bytes.Buffer
	writer := tar.NewWriter(&buffer)
	defer writer.Close()

	for _, file := range files {
		err := writeFile(writer, file)
		if err != nil {
			return fmt.Errorf("error writing file %q to archive: %w", file, err)
		}
	}

	// Calling Close() is required for the footer to be properly written.
	err := writer.Close()
	if err != nil {
		return fmt.Errorf("erorr closing archive writer: %w", err)
	}

	return os.WriteFile(outfile, buffer.Bytes(), 0644)
}

func writeFile(w *tar.Writer, path string) error {
	fileinfo, err := os.Stat(path)
	if err != nil {
		return fmt.Errorf("error getting file information: %w", err)
	}

	file, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("error opening file: %w", err)
	}

	// By default only the basename of the file will be stored in the header. This means that the
	// directory structure won't be preserved. If the structure is desired, the header can be manually
	// adjusted to include the full path.
	header, err := tar.FileInfoHeader(fileinfo, fileinfo.Name())
	if err != nil {
		return fmt.Errorf("error constructing file header: %w", err)
	}

	err = w.WriteHeader(header)
	if err != nil {
		return fmt.Errorf("error writing header: %w", err)
	}

	_, err = io.Copy(w, file)
	if err != nil {
		return fmt.Errorf("error writing file contents: %w", err)
	}

	return nil
}
