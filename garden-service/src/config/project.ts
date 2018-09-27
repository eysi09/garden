/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Joi from "joi"
import { safeDump } from "js-yaml"
import {
  joiArray,
  joiIdentifier,
  joiVariables,
  Primitive,
  joiRepositoryUrl,
} from "./common"

export interface ProviderConfig {
  name: string
  [key: string]: any
}

export const providerConfigBaseSchema = Joi.object()
  .keys({
    name: joiIdentifier().required()
      .description("The name of the provider plugin to configure.")
      .example("local-kubernetes"),
  })
  .unknown(true)
  .meta({ extendable: true })

export interface Provider<T extends ProviderConfig = any> {
  name: string
  config: T
}

export interface CommonEnvironmentConfig {
  providers: ProviderConfig[]  // further validated by each plugin
  variables: { [key: string]: Primitive }
}

export const environmentConfigSchema = Joi.object()
  .keys({
    providers: joiArray(providerConfigBaseSchema)
      .unique("name")
      .description(
        "A list of providers that should be used for this environment, and their configuration. " +
        "Please refer to individual plugins/providers for details on how to configure them.",
      ),
    variables: joiVariables()
      .description("A key/value map of variables that modules can reference when using this environment."),
  })

export interface Environment extends CommonEnvironmentConfig {
  name: string
}

export const environmentSchema = environmentConfigSchema
  .keys({
    name: Joi.string()
      .required()
      .description("The name of the current environment."),
  })

export interface SourceConfig {
  name: string
  repositoryUrl: string
}

export const projectSourceSchema = Joi.object()
  .keys({
    name: joiIdentifier()
      .required()
      .description("The name of the source to import"),
    repositoryUrl: joiRepositoryUrl()
      .required(),
  })

export const projectSourcesSchema = joiArray(projectSourceSchema)
  .unique("name")
  .description("A list of remote sources to import into project")

export interface ProjectConfig {
  name: string
  defaultEnvironment: string
  environmentDefaults: CommonEnvironmentConfig
  environments: Environment[]
  sources?: SourceConfig[]
}

export const defaultProviders = [
  { name: "container" },
]

export const defaultEnvironments: Environment[] = [
  {
    name: "local",
    providers: [
      {
        name: "local-kubernetes",
      },
    ],
    variables: {},
  },
]

const environmentDefaults = {
  providers: [],
  variables: {},
}

export const projectNameSchema = joiIdentifier()
  .required()
  .description("The name of the project.")
  .example("my-sweet-project")

export const projectSchema = Joi.object()
  .keys({
    name: projectNameSchema,
    defaultEnvironment: Joi.string()
      .default("", "<first specified environment>")
      .description("The default environment to use when calling commands without the `--env` parameter."),
    environmentDefaults: environmentConfigSchema
      .default(() => environmentDefaults, safeDump(environmentDefaults))
      .example(environmentDefaults)
      .description(
        "Default environment settings, that are inherited (but can be overridden) by each configured environment",
      ),
    environments: joiArray(environmentConfigSchema.keys({ name: joiIdentifier().required() }))
      .unique("name")
      .default(() => ({ ...defaultEnvironments }), safeDump(defaultEnvironments))
      .description("A list of environments to configure for the project.")
      .example(defaultEnvironments),
    sources: projectSourcesSchema,
  })
  .required()
  .description(
    "The configuration for a Garden project. This should be specified in the garden.yml file in your project root.",
  )

// this is used for default handlers in the action handler
export const defaultProvider: Provider = {
  name: "_default",
  config: {},
}
