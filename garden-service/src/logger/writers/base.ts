/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LogEntry } from "../log-entry"
import { Logger } from "../logger"

export abstract class Writer {
  abstract render(...args): string | string[] | null
  abstract onGraphChange(entry: LogEntry, logger: Logger): void
  abstract stop(): void
}
