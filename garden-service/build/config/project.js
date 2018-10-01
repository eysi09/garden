"use strict";
/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const js_yaml_1 = require("js-yaml");
const common_1 = require("./common");
exports.providerConfigBaseSchema = Joi.object()
    .keys({
    name: common_1.joiIdentifier().required()
        .description("The name of the provider plugin to configure.")
        .example("local-kubernetes"),
})
    .unknown(true)
    .meta({ extendable: true });
exports.environmentConfigSchema = Joi.object()
    .keys({
    providers: common_1.joiArray(exports.providerConfigBaseSchema)
        .unique("name")
        .description("A list of providers that should be used for this environment, and their configuration. " +
        "Please refer to individual plugins/providers for details on how to configure them."),
    variables: common_1.joiVariables()
        .description("A key/value map of variables that modules can reference when using this environment."),
});
exports.environmentSchema = exports.environmentConfigSchema
    .keys({
    name: Joi.string()
        .required()
        .description("The name of the current environment."),
});
exports.projectSourceSchema = Joi.object()
    .keys({
    name: common_1.joiIdentifier()
        .required()
        .description("The name of the source to import"),
    repositoryUrl: common_1.joiRepositoryUrl()
        .required(),
});
exports.projectSourcesSchema = common_1.joiArray(exports.projectSourceSchema)
    .unique("name")
    .description("A list of remote sources to import into project");
exports.defaultProviders = [
    { name: "container" },
];
exports.defaultEnvironments = [
    {
        name: "local",
        providers: [
            {
                name: "local-kubernetes",
            },
        ],
        variables: {},
    },
];
const environmentDefaults = {
    providers: [],
    variables: {},
};
exports.projectNameSchema = common_1.joiIdentifier()
    .required()
    .description("The name of the project.")
    .example("my-sweet-project");
exports.projectSchema = Joi.object()
    .keys({
    name: exports.projectNameSchema,
    defaultEnvironment: Joi.string()
        .default("", "<first specified environment>")
        .description("The default environment to use when calling commands without the `--env` parameter."),
    environmentDefaults: exports.environmentConfigSchema
        .default(() => environmentDefaults, js_yaml_1.safeDump(environmentDefaults))
        .example(environmentDefaults)
        .description("Default environment settings, that are inherited (but can be overridden) by each configured environment"),
    environments: common_1.joiArray(exports.environmentConfigSchema.keys({ name: common_1.joiIdentifier().required() }))
        .unique("name")
        .default(() => (Object.assign({}, exports.defaultEnvironments)), js_yaml_1.safeDump(exports.defaultEnvironments))
        .description("A list of environments to configure for the project.")
        .example(exports.defaultEnvironments),
    sources: exports.projectSourcesSchema,
})
    .required()
    .description("The configuration for a Garden project. This should be specified in the garden.yml file in your project root.");
// this is used for default handlers in the action handler
exports.defaultProvider = {
    name: "_default",
    config: {},
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFJLEVBQUUsc0JBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN2RixNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ2QsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFNLDJCQUFtQixFQUFHLEVBQUUsa0JBQVEsQ0FBQywyQkFBbUIsQ0FBQyxDQUFDO1NBQzFFLFdBQVcsQ0FBQyxzREFBc0QsQ0FBQztTQUNuRSxPQUFPLENBQUMsMkJBQW1CLENBQUM7SUFDL0IsT0FBTyxFQUFFLDRCQUFvQjtDQUM5QixDQUFDO0tBQ0QsUUFBUSxFQUFFO0tBQ1YsV0FBVyxDQUNWLCtHQUErRyxDQUNoSCxDQUFBO0FBRUgsMERBQTBEO0FBQzdDLFFBQUEsZUFBZSxHQUFhO0lBQ3ZDLElBQUksRUFBRSxVQUFVO0lBQ2hCLE1BQU0sRUFBRSxFQUFFO0NBQ1gsQ0FBQSIsImZpbGUiOiJjb25maWcvcHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTggR2FyZGVuIFRlY2hub2xvZ2llcywgSW5jLiA8aW5mb0BnYXJkZW4uaW8+XG4gKlxuICogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBKb2kgZnJvbSBcImpvaVwiXG5pbXBvcnQgeyBzYWZlRHVtcCB9IGZyb20gXCJqcy15YW1sXCJcbmltcG9ydCB7XG4gIGpvaUFycmF5LFxuICBqb2lJZGVudGlmaWVyLFxuICBqb2lWYXJpYWJsZXMsXG4gIFByaW1pdGl2ZSxcbiAgam9pUmVwb3NpdG9yeVVybCxcbn0gZnJvbSBcIi4vY29tbW9uXCJcblxuZXhwb3J0IGludGVyZmFjZSBQcm92aWRlckNvbmZpZyB7XG4gIG5hbWU6IHN0cmluZ1xuICBba2V5OiBzdHJpbmddOiBhbnlcbn1cblxuZXhwb3J0IGNvbnN0IHByb3ZpZGVyQ29uZmlnQmFzZVNjaGVtYSA9IEpvaS5vYmplY3QoKVxuICAua2V5cyh7XG4gICAgbmFtZTogam9pSWRlbnRpZmllcigpLnJlcXVpcmVkKClcbiAgICAgIC5kZXNjcmlwdGlvbihcIlRoZSBuYW1lIG9mIHRoZSBwcm92aWRlciBwbHVnaW4gdG8gY29uZmlndXJlLlwiKVxuICAgICAgLmV4YW1wbGUoXCJsb2NhbC1rdWJlcm5ldGVzXCIpLFxuICB9KVxuICAudW5rbm93bih0cnVlKVxuICAubWV0YSh7IGV4dGVuZGFibGU6IHRydWUgfSlcblxuZXhwb3J0IGludGVyZmFjZSBQcm92aWRlcjxUIGV4dGVuZHMgUHJvdmlkZXJDb25maWcgPSBhbnk+IHtcbiAgbmFtZTogc3RyaW5nXG4gIGNvbmZpZzogVFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbW1vbkVudmlyb25tZW50Q29uZmlnIHtcbiAgcHJvdmlkZXJzOiBQcm92aWRlckNvbmZpZ1tdICAvLyBmdXJ0aGVyIHZhbGlkYXRlZCBieSBlYWNoIHBsdWdpblxuICB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogUHJpbWl0aXZlIH1cbn1cblxuZXhwb3J0IGNvbnN0IGVudmlyb25tZW50Q29uZmlnU2NoZW1hID0gSm9pLm9iamVjdCgpXG4gIC5rZXlzKHtcbiAgICBwcm92aWRlcnM6IGpvaUFycmF5KHByb3ZpZGVyQ29uZmlnQmFzZVNjaGVtYSlcbiAgICAgIC51bmlxdWUoXCJuYW1lXCIpXG4gICAgICAuZGVzY3JpcHRpb24oXG4gICAgICAgIFwiQSBsaXN0IG9mIHByb3ZpZGVycyB0aGF0IHNob3VsZCBiZSB1c2VkIGZvciB0aGlzIGVudmlyb25tZW50LCBhbmQgdGhlaXIgY29uZmlndXJhdGlvbi4gXCIgK1xuICAgICAgICBcIlBsZWFzZSByZWZlciB0byBpbmRpdmlkdWFsIHBsdWdpbnMvcHJvdmlkZXJzIGZvciBkZXRhaWxzIG9uIGhvdyB0byBjb25maWd1cmUgdGhlbS5cIixcbiAgICAgICksXG4gICAgdmFyaWFibGVzOiBqb2lWYXJpYWJsZXMoKVxuICAgICAgLmRlc2NyaXB0aW9uKFwiQSBrZXkvdmFsdWUgbWFwIG9mIHZhcmlhYmxlcyB0aGF0IG1vZHVsZXMgY2FuIHJlZmVyZW5jZSB3aGVuIHVzaW5nIHRoaXMgZW52aXJvbm1lbnQuXCIpLFxuICB9KVxuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlyb25tZW50IGV4dGVuZHMgQ29tbW9uRW52aXJvbm1lbnRDb25maWcge1xuICBuYW1lOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNvbnN0IGVudmlyb25tZW50U2NoZW1hID0gZW52aXJvbm1lbnRDb25maWdTY2hlbWFcbiAgLmtleXMoe1xuICAgIG5hbWU6IEpvaS5zdHJpbmcoKVxuICAgICAgLnJlcXVpcmVkKClcbiAgICAgIC5kZXNjcmlwdGlvbihcIlRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IGVudmlyb25tZW50LlwiKSxcbiAgfSlcblxuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VDb25maWcge1xuICBuYW1lOiBzdHJpbmdcbiAgcmVwb3NpdG9yeVVybDogc3RyaW5nXG59XG5cbmV4cG9ydCBjb25zdCBwcm9qZWN0U291cmNlU2NoZW1hID0gSm9pLm9iamVjdCgpXG4gIC5rZXlzKHtcbiAgICBuYW1lOiBqb2lJZGVudGlmaWVyKClcbiAgICAgIC5yZXF1aXJlZCgpXG4gICAgICAuZGVzY3JpcHRpb24oXCJUaGUgbmFtZSBvZiB0aGUgc291cmNlIHRvIGltcG9ydFwiKSxcbiAgICByZXBvc2l0b3J5VXJsOiBqb2lSZXBvc2l0b3J5VXJsKClcbiAgICAgIC5yZXF1aXJlZCgpLFxuICB9KVxuXG5leHBvcnQgY29uc3QgcHJvamVjdFNvdXJjZXNTY2hlbWEgPSBqb2lBcnJheShwcm9qZWN0U291cmNlU2NoZW1hKVxuICAudW5pcXVlKFwibmFtZVwiKVxuICAuZGVzY3JpcHRpb24oXCJBIGxpc3Qgb2YgcmVtb3RlIHNvdXJjZXMgdG8gaW1wb3J0IGludG8gcHJvamVjdFwiKVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb2plY3RDb25maWcge1xuICBuYW1lOiBzdHJpbmdcbiAgZGVmYXVsdEVudmlyb25tZW50OiBzdHJpbmdcbiAgZW52aXJvbm1lbnREZWZhdWx0czogQ29tbW9uRW52aXJvbm1lbnRDb25maWdcbiAgZW52aXJvbm1lbnRzOiBFbnZpcm9ubWVudFtdXG4gIHNvdXJjZXM/OiBTb3VyY2VDb25maWdbXVxufVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdFByb3ZpZGVycyA9IFtcbiAgeyBuYW1lOiBcImNvbnRhaW5lclwiIH0sXG5dXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0RW52aXJvbm1lbnRzOiBFbnZpcm9ubWVudFtdID0gW1xuICB7XG4gICAgbmFtZTogXCJsb2NhbFwiLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAge1xuICAgICAgICBuYW1lOiBcImxvY2FsLWt1YmVybmV0ZXNcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICB2YXJpYWJsZXM6IHt9LFxuICB9LFxuXVxuXG5jb25zdCBlbnZpcm9ubWVudERlZmF1bHRzID0ge1xuICBwcm92aWRlcnM6IFtdLFxuICB2YXJpYWJsZXM6IHt9LFxufVxuXG5leHBvcnQgY29uc3QgcHJvamVjdE5hbWVTY2hlbWEgPSBqb2lJZGVudGlmaWVyKClcbiAgLnJlcXVpcmVkKClcbiAgLmRlc2NyaXB0aW9uKFwiVGhlIG5hbWUgb2YgdGhlIHByb2plY3QuXCIpXG4gIC5leGFtcGxlKFwibXktc3dlZXQtcHJvamVjdFwiKVxuXG5leHBvcnQgY29uc3QgcHJvamVjdFNjaGVtYSA9IEpvaS5vYmplY3QoKVxuICAua2V5cyh7XG4gICAgbmFtZTogcHJvamVjdE5hbWVTY2hlbWEsXG4gICAgZGVmYXVsdEVudmlyb25tZW50OiBKb2kuc3RyaW5nKClcbiAgICAgIC5kZWZhdWx0KFwiXCIsIFwiPGZpcnN0IHNwZWNpZmllZCBlbnZpcm9ubWVudD5cIilcbiAgICAgIC5kZXNjcmlwdGlvbihcIlRoZSBkZWZhdWx0IGVudmlyb25tZW50IHRvIHVzZSB3aGVuIGNhbGxpbmcgY29tbWFuZHMgd2l0aG91dCB0aGUgYC0tZW52YCBwYXJhbWV0ZXIuXCIpLFxuICAgIGVudmlyb25tZW50RGVmYXVsdHM6IGVudmlyb25tZW50Q29uZmlnU2NoZW1hXG4gICAgICAuZGVmYXVsdCgoKSA9PiBlbnZpcm9ubWVudERlZmF1bHRzLCBzYWZlRHVtcChlbnZpcm9ubWVudERlZmF1bHRzKSlcbiAgICAgIC5leGFtcGxlKGVudmlyb25tZW50RGVmYXVsdHMpXG4gICAgICAuZGVzY3JpcHRpb24oXG4gICAgICAgIFwiRGVmYXVsdCBlbnZpcm9ubWVudCBzZXR0aW5ncywgdGhhdCBhcmUgaW5oZXJpdGVkIChidXQgY2FuIGJlIG92ZXJyaWRkZW4pIGJ5IGVhY2ggY29uZmlndXJlZCBlbnZpcm9ubWVudFwiLFxuICAgICAgKSxcbiAgICBlbnZpcm9ubWVudHM6IGpvaUFycmF5KGVudmlyb25tZW50Q29uZmlnU2NoZW1hLmtleXMoeyBuYW1lOiBqb2lJZGVudGlmaWVyKCkucmVxdWlyZWQoKSB9KSlcbiAgICAgIC51bmlxdWUoXCJuYW1lXCIpXG4gICAgICAuZGVmYXVsdCgoKSA9PiAoeyAuLi5kZWZhdWx0RW52aXJvbm1lbnRzIH0pLCBzYWZlRHVtcChkZWZhdWx0RW52aXJvbm1lbnRzKSlcbiAgICAgIC5kZXNjcmlwdGlvbihcIkEgbGlzdCBvZiBlbnZpcm9ubWVudHMgdG8gY29uZmlndXJlIGZvciB0aGUgcHJvamVjdC5cIilcbiAgICAgIC5leGFtcGxlKGRlZmF1bHRFbnZpcm9ubWVudHMpLFxuICAgIHNvdXJjZXM6IHByb2plY3RTb3VyY2VzU2NoZW1hLFxuICB9KVxuICAucmVxdWlyZWQoKVxuICAuZGVzY3JpcHRpb24oXG4gICAgXCJUaGUgY29uZmlndXJhdGlvbiBmb3IgYSBHYXJkZW4gcHJvamVjdC4gVGhpcyBzaG91bGQgYmUgc3BlY2lmaWVkIGluIHRoZSBnYXJkZW4ueW1sIGZpbGUgaW4geW91ciBwcm9qZWN0IHJvb3QuXCIsXG4gIClcblxuLy8gdGhpcyBpcyB1c2VkIGZvciBkZWZhdWx0IGhhbmRsZXJzIGluIHRoZSBhY3Rpb24gaGFuZGxlclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRQcm92aWRlcjogUHJvdmlkZXIgPSB7XG4gIG5hbWU6IFwiX2RlZmF1bHRcIixcbiAgY29uZmlnOiB7fSxcbn1cbiJdfQ==
