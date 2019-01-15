/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { kebabCase, flatten, entries } from "lodash"
import React from "react"

import Sidebar from "../components/sidebar"
import { DashboardPage } from "../api/types"
import { StatusConsumer } from "../context/status"

export interface Page extends DashboardPage {
  path: string
}

const builtinPages: Page[] = [
  {
    title: "Overview",
    description: "Overview",
    path: "/",
    newWindow: false,
    url: "",
  },
  {
    title: "Service Graph",
    description: "Service Graph",
    path: "/graph",
    newWindow: false,
    url: "",
  },
  {
    title: "Logs",
    description: "Logs",
    path: "/logs",
    newWindow: false,
    url: "",
  },
]

export default () => (
  <StatusConsumer>
    {({ status }) => {
      const pages: Page[] = flatten(entries(status.providers).map(([providerName, providerStatus]) => {
        return providerStatus.dashboardPages.map(p => ({
          ...p,
          path: `/provider/${providerName}/${kebabCase(p.title)}`,
          description: p.description + ` (from provider ${providerName})`,
        }))
      }))

      return <Sidebar pages={[...builtinPages, ...pages]} />
    }}
  </StatusConsumer>
)
