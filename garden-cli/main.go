package main

import (
	"errors"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"time"

	"os/exec"
	"path"
)

func check(err error) {
	if err != nil {
		panic(err)
	}
}

func initRand() {
	rand.Seed(time.Now().UnixNano())
}

var letters = []rune("abcdefghijklmnopqrstuvwxyz1234567890")

func randSeq(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func main() {
	// find the project garden.yml
	cwd, err := os.Getwd()
	check(err)

	_, projectName := findProject(cwd)

	// get the git root and relative path to it (we mount the git root, so that git version checks work)
	git, err := exec.LookPath("git")
	if err != nil {
		panic(errors.New("could not find git (Garden requires git to be installed)"))
	}

	cmd := exec.Command(git, "rev-parse", "--show-toplevel")
	cmd.Env = os.Environ()
	gitRoot, err := cmd.Output()
	if err != nil {
		panic(errors.New(
			"current directory is not in a git repository (Garden projects currently need to be inside a git repository)",
		))
	}

	relPath, err := filepath.Rel(strings.TrimSpace(string(gitRoot)), cwd)
	check(err)

	workingDir := path.Join("/project", relPath)

	err = runGardenService(projectName, string(gitRoot), workingDir, os.Args[1:])
	if err != nil {
		os.Exit(1)
	}
}
