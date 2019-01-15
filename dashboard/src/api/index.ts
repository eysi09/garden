/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import axios from "axios"

import {
  FetchConfigResponse,
  FetchStatusResponse,
  FetchLogResponse,
  ApiRequest,
  FetchGraphResponse,
} from "./types"

export async function fetchConfig(): Promise<FetchConfigResponse> {
  return apiPost<FetchConfigResponse>("get.config")
}

export async function fetchGraph(): Promise<FetchGraphResponse> {
  return apiPost<FetchGraphResponse>("get.graph")
}

export async function fetchStatus(): Promise<FetchStatusResponse> {
  return apiPost<FetchStatusResponse>("get.status")
}

export async function fetchLogs(services?: string[]): Promise<FetchLogResponse> {
  const params = services ? { service: services } : {}
  return apiPost<FetchLogResponse>("logs", params)
}

async function apiPost<T>(command: string, parameters: {} = {}): Promise<T> {
  const url = "/api"
  const method = "POST"
  const headers = { "Content-Type": "application/json" }
  const data: ApiRequest = { command, parameters }

  const res = await axios({ url, method, headers, data })

  return res.data.result
}
