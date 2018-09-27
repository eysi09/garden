package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"

	"gopkg.in/yaml.v2"
)

// Config type must be public for the yaml parser (for some reason). We only need the project key and the name.
type Config struct {
	Project struct {
		Name *string
	}
}

func findProject(cwd string) (string, string) {
	projectDir := cwd

	for {
		configPath := path.Join(projectDir, "garden.yml")

		if _, err := os.Stat(configPath); !os.IsNotExist(err) {
			configYaml, err := ioutil.ReadFile(configPath)
			check(err)

			config := Config{}

			err = yaml.Unmarshal(configYaml, &config)
			if err != nil {
				fmt.Printf("Unable to parse %s as a valid garden configuration file", configPath)
				os.Exit(1)
			}

			if config.Project.Name != nil {
				// found project config
				return projectDir, *config.Project.Name
			}
		}

		// move up one level
		projectDir = path.Dir(projectDir)

		if projectDir == "/" {
			fmt.Printf("Not a project directory (or any of the parent directories): %s", cwd)
			os.Exit(1)
		}
	}
}
