/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { join } from "path"
import { STATIC_DIR } from "../../constants"
import { Garden } from "../../garden"
import { KubernetesProvider } from "./kubernetes"

export const GARDEN_SYSTEM_NAMESPACE = "garden-system"

const systemProjectPath = join(STATIC_DIR, "kubernetes", "system")
export const systemSymbol = Symbol()

export function isSystemGarden(provider: KubernetesProvider): boolean {
  return provider.config._system === systemSymbol
}

export async function getSystemGarden(provider: KubernetesProvider): Promise<Garden> {
  return Garden.factory(systemProjectPath, {
    env: "default",
    config: {
      version: "0",
      dirname: "system",
      path: systemProjectPath,
      project: {
        name: "garden-system",
        environmentDefaults: {
          providers: [],
          variables: {},
        },
        defaultEnvironment: "default",
        environments: [
          {
            name: "default",
            providers: [
              {
                name: "local-kubernetes",
                context: provider.config.context,
                namespace: GARDEN_SYSTEM_NAMESPACE,
                _system: systemSymbol,
              },
            ],
            variables: {},
          },
        ],
      },
    },
  })
}
