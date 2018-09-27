package main

import (
	"errors"
	"os"
	"os/exec"
	"regexp"
	"encoding/json"
	"fmt"

	"github.com/mitchellh/go-homedir"
)

func runGardenService(projectName string, gitRoot string, workingDir string, args []string) (error) {
	// TODO: use specific garden-service version
	imageName := "garden-service:latest"
	homeDir, err := homedir.Dir()
	check(err)
	homeDir, err = homedir.Expand(homeDir)
	check(err)
	jsonArgs, err := json.Marshal(args)
	check(err)

	initRand()
	podName := "garden-" + projectName + "-" + randSeq(6)

	// We basically specify the Pod here, overriding most of the kubectl run params
	// TODO: figure out how to make this nice and typesafe
	overrides := fmt.Sprintf(`{
		"apiVersion": "v1",
		"spec": {
			"hostNetwork": true,
			"containers": [
				{
					"name": "%s",
					"image": "%s",
					"imagePullPolicy": "Never",
					"workingDir": "%s",
					"args": %s,
					"stdin": true,
					"stdinOnce": true,
					"tty": true,
					"volumeMounts": [
						{
							"mountPath": "/project",
							"name": "project"
						},
						{
							"mountPath": "/root/.docker",
							"name": "docker-home"
						},
						{
							"mountPath": "/root/.kube",
							"name": "kube-home"
						},
						{
							"mountPath": "/var/run/docker.sock",
							"name": "docker-sock"
						}
					]
				}
			],
			"volumes": [
				{
					"name": "project",
					"hostPath": { "path": "%s" }
				},
				{
					"name": "docker-home",
					"hostPath": { "path": "%s/.docker" }
				},
				{
					"name": "kube-home",
					"hostPath": { "path": "%s/.kube" }
				},
				{
					"name": "docker-sock",
					"hostPath": { "path": "/var/run/docker.sock" }
				}
			]
		}
	}`, podName, imageName, workingDir, string(jsonArgs), gitRoot, homeDir, homeDir)

	whitespaceRe := regexp.MustCompile(`\s+`)

	kubectlArgs := append(
		[]string{
			"run", "-i", "--tty", "--rm", "--quiet",
			podName,
			// trimming whitespace to make sure this parses okay
			"--overrides", whitespaceRe.ReplaceAllString(overrides, ""),
			"--restart", "Never",
			"--image", imageName,
		},
	)
	// fmt.Println("kubectl ", args)

	binary, err := exec.LookPath("kubectl")
	if err != nil {
		panic(errors.New(
			"could not find kubectl - " +
			"Garden requires a configured local Kubernetes cluster and for kubectl to be configured to access it",
		))
	}

	cmd := exec.Command(binary, kubectlArgs...)

	cmd.Env = os.Environ()
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout

	return cmd.Run()
}