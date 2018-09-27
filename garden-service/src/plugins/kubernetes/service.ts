/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ContainerService } from "../container"

export async function createServices(service: ContainerService, namespace: string) {
  const services: any = []

  const addService = (name: string, type: string, servicePorts: any[]) => {
    services.push({
      apiVersion: "v1",
      kind: "Service",
      metadata: {
        name,
        annotations: {},
        namespace,
      },
      spec: {
        ports: servicePorts,
        selector: {
          service: service.name,
        },
        type,
      },
    })
  }

  // first add internally exposed (ClusterIP) service
  const internalPorts: any = []
  const ports = service.spec.ports

  for (const portSpec of ports) {
    internalPorts.push({
      name: portSpec.name,
      protocol: portSpec.protocol,
      targetPort: portSpec.containerPort,
      port: portSpec.containerPort,
    })
  }

  if (internalPorts.length) {
    addService(service.name, "ClusterIP", internalPorts)
  }

  // optionally add a NodePort service for externally open ports, if applicable
  // TODO: explore nicer ways to do this
  const exposedPorts = ports.filter(portSpec => portSpec.nodePort)

  if (exposedPorts.length > 0) {
    addService(service.name + "-nodeport", "NodePort", exposedPorts.map(portSpec => ({
      // TODO: do the parsing and defaults when loading the yaml
      name: portSpec.name,
      protocol: portSpec.protocol,
      port: portSpec.containerPort,
      nodePort: portSpec.nodePort,
    })))
  }

  return services
}
