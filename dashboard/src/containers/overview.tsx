/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from "react"

import { ConfigConsumer } from "../context/config"
import Overview from "../components/overview"
import { StatusConsumer } from "../context/status"

export default () => (
  <StatusConsumer>
    {({ status }) => (
      <ConfigConsumer>
        {({ config }) => <Overview config={config} status={status} />}
      </ConfigConsumer>
    )}
  </StatusConsumer>
)
