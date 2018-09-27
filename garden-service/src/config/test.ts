/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Joi from "joi"
import {
  joiArray,
  joiIdentifier,
} from "./common"

export interface TestSpec { }

export interface BaseTestSpec extends TestSpec {
  name: string
  dependencies: string[]
  timeout: number | null
}

export const baseTestSpecSchema = Joi.object()
  .keys({
    name: joiIdentifier()
      .required()
      .description("The name of the test."),
    dependencies: joiArray(Joi.string())
      .description("The names of services that must be running before the test is run."),
    timeout: Joi.number()
      .allow(null)
      .default(null)
      .description("Maximum duration (in seconds) of the test run."),
  })
  .description("Required configuration for module tests.")

export interface TestConfig<T extends TestSpec = TestSpec> extends BaseTestSpec {
  // Plugins can add custom fields that are kept here
  spec: T
}

export const testConfigSchema = baseTestSpecSchema
  .keys({
    spec: Joi.object()
      .meta({ extendable: true })
      .description("The configuration for the test, as specified by its module's provider."),
  })
  .description("Configuration for a module test.")
