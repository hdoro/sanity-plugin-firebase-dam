import { definePlugin } from 'sanity'
import {
  StudioTool,
  ToolIcon,
  VendorConfiguration,
  createInput,
  getCustomDataSchema,
  getDimensionsSchema,
  getStoredFileSchema,
} from 'sanity-plugin-external-files'
import deleteFile from './deleteFile'
import { credentialsFields, schemaConfig } from './schema.config'
import uploadFile from './uploadFile'

export const digitalOceanFiles = definePlugin((userConfig?: UserConfig) => {
  const config = buildConfig(userConfig)
  return {
    name: 'digital-ocean-files',
    schema: {
      types: [
        // digital-ocean-files.custom-data
        getCustomDataSchema(config, schemaConfig),
        // digital-ocean-files.dimensions
        getDimensionsSchema(config),
        // digital-ocean-files.storedFile
        getStoredFileSchema(config, schemaConfig),
        {
          name: 'digital-ocean-files.media',
          title: 'Digital Ocean media',
          type: 'object',
          components: {
            input: createInput(config),
          },
          fields: [
            {
              name: 'asset',
              title: 'Asset',
              type: 'reference',
              // @TODO: how to handle schema/id changes?
              to: [{ type: 'digital-ocean-files.storedFile' }],
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
    tools: [
      {
        name: 'digital-ocean-files',
        title: config.toolTitle,
        component: () => <StudioTool {...config} />,
        icon: ToolIcon,
      },
    ],
  }
})

function buildConfig(userConfig: UserConfig = {}): VendorConfiguration {
  return {
    id: 'digital-ocean-files',
    customDataFieldName: 'digitalOcean',
    defaultAccept: userConfig.defaultAccept,
    toolTitle: userConfig.toolTitle ?? 'Media Library (DigitalOcean)',
    credentialsFields,
    deleteFile,
    uploadFile,
  }
}

interface UserConfig {
  toolTitle?: string
  defaultAccept?: VendorConfiguration['defaultAccept']
}
