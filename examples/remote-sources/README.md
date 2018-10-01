# Remote sources example project

This example demonstrates how you can import remote sources and remote modules into a Garden project.

> Remote source: A collection of one or more Garden modules that live in a repository different from the main project repo. The `garden.yml` config files are co-located with the modules in the remote repository.

> Remote module: The remote source code for a single Garden module. In this case, the `garden.yml` config file is stored in the main project repo while the module code itself is in the remote repository.

## About

This project is the same as the [multi-container example](https://github.com/garden-io/garden/tree/master/examples/multi-container)—except that in this case the services live in their own repositories. The repositories are:

* [Database services](https://github.com/garden-io/garden-example-remote-sources-db-services) (contains the Postgres and Redis services)
* [Web services](https://github.com/garden-io/garden-example-remote-sources-web-services) (contains the Python Vote web service and the Node.js Result web service)
* [Java worker module](https://github.com/garden-io/garden-example-remote-module-jworker)

_This split is pretty arbitrary and doesn't necessarily reflect how you would normally separate services into different repositories._

## Usage

This project doesn't require any setup and can be deployed right away. If this is your first time working with this project, Garden will start by fetching the remote source code:
```sh
garden deploy
```
Garden will continue to use the version originally downloaded. Use the `update-remote sources|modules|all` command to fetch the latest version of your remote sources and modules:
```sh
garden update-remote modules jworker
```
If you however change the repository URL of your remote source or module (e.g. switch to a different tag or branch), Garden will automatically fetch the correct version.

If you want to make changes to the remote source you can link it to a local directory with the `link source|module` command:
```sh
garden link source web-services path/to/local/project
```
Use the `unlink source|module` command to unlink it again:
```sh
garden unlink source web-services
```

## Further reading

### Project structure

Looking at the project structure, you'll notice that the project doesn't contain any code outside the `garden.yml` config files. Rather, the config files themselves contain the URLs to the remote repositories.

```sh
tree
.
├── README.md
├── garden.yml
└── services
    └── jworker
        └── garden.yml

2 directories, 3 files
```

### Configuring remote sources

For this project, we want to import the database and web services as remote _sources_. This means that the entire source code gets embedded into the project and treated just like our other project files. As usual, Garden will scan the project for `garden.yml` files, and include all modules it finds.

To import remote sources, we add them under the `sources` key in the top-level project configuration file:

```yaml
project:
  name: remote-sources
  sources:
    - name: web-services
      repositoryUrl: https://github.com/garden-io/garden-example-remote-sources-web-services.git#master
    - name: db-services
      repositoryUrl: https://github.com/garden-io/garden-example-remote-sources-db-services.git#master
```

> Remote repository URLs must contain a hash part that references a specific branch or tag, e.g. `https://github.com/org/repo.git/#v1.0`.

### Configuring remote modules

Additionally, we want to import the Java worker as a remote _module_. In that case, Garden assumes that the remote repository contains the source code for a single Garden module. Furthermore, the `garden.yml` config file for that module is kept in the main project repo:
```sh
tree services
services
└── jworker
    └── garden.yml

1 directory, 1 file
```
and the path to the repository URL is added under the `repositoryUrl` key like so:
```yaml
module:
  description: worker
  type: container
  name: jworker
  repositoryUrl: https://github.com/garden-io/garden-example-remote-module-jworker.git#master
  services:
    - name: javaworker
      dependencies:
        - redis
```

Note that a project can contain its own modules and also import remote sources and modules.