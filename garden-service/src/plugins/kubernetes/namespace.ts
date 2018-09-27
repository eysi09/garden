/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PluginContext } from "../../plugin-context"
import { KubeApi } from "./api"
import { KubernetesProvider } from "./kubernetes"
import { name as providerName } from "./kubernetes"
import { AuthenticationError } from "../../exceptions"

const created: { [name: string]: boolean } = {}

export async function ensureNamespace(api: KubeApi, namespace: string) {
  if (!created[namespace]) {
    const namespacesStatus = await api.core.listNamespace()

    for (const n of namespacesStatus.body.items) {
      if (n.status.phase === "Active") {
        created[n.metadata.name] = true
      }
    }

    if (!created[namespace]) {
      // TODO: the types for all the create functions in the library are currently broken
      await api.core.createNamespace(<any>{
        apiVersion: "v1",
        kind: "Namespace",
        metadata: {
          name: namespace,
          annotations: {
            "garden.io/generated": "true",
          },
        },
      })
      created[namespace] = true
    }
  }
}

export async function getNamespace(
  { ctx, provider, suffix, skipCreate }:
    { ctx: PluginContext, provider: KubernetesProvider, suffix?: string, skipCreate?: boolean },
): Promise<string> {
  let namespace

  if (provider.config.namespace) {
    namespace = provider.config.namespace
  } else {
    const localConfig = await ctx.localConfigStore.get()
    const k8sConfig = localConfig.kubernetes || {}
    let { username, ["previous-usernames"]: previousUsernames } = k8sConfig

    if (!username) {
      username = provider.config.defaultUsername
    }

    if (!username) {
      throw new AuthenticationError(
        `User not logged into provider ${providerName}. Please specify defaultUsername in provider ` +
        `config or run garden init.`,
        { previousUsernames, provider: providerName },
      )
    }

    namespace = `garden--${username}--${ctx.projectName}`
  }

  if (suffix) {
    namespace = `${namespace}--${suffix}`
  }

  if (!skipCreate) {
    const api = new KubeApi(provider)
    await ensureNamespace(api, namespace)
  }

  return namespace
}

export async function getAppNamespace(ctx: PluginContext, provider: KubernetesProvider) {
  return getNamespace({ ctx, provider })
}

export function getMetadataNamespace(ctx: PluginContext, provider: KubernetesProvider) {
  return getNamespace({ ctx, provider, suffix: "metadata" })
}

export async function getAllGardenNamespaces(api: KubeApi): Promise<string[]> {
  const allNamespaces = await api.core.listNamespace()
  return allNamespaces.body.items
    .map(n => n.metadata.name)
    .filter(n => n.startsWith("garden--"))
}
