import { UploadIcon } from '@sanity/icons'
import {
  Button,
  Card,
  Heading,
  Label,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import DefaultFormField from 'part:@sanity/components/formfields/default'
import React from 'react'
import {
  AcceptedCredentialField,
  VendorConfiguration,
  VendorCredentials,
} from '../../types'

import { CredentialsContext } from './CredentialsProvider'

const ConfigureCredentials: React.FC<{
  onCredentialsSaved?: (success: boolean) => void
  vendorConfig: VendorConfiguration
}> = (props) => {
  const { saveCredentials, credentials } = React.useContext(CredentialsContext)
  const [isLoading, setIsLoading] = React.useState(false)

  // Form values:
  const [formValues, setFormValues] = React.useState<VendorCredentials>({})

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    const success = await saveCredentials(formValues)
    setIsLoading(false)
    if (props.onCredentialsSaved) {
      props.onCredentialsSaved(success)
    }
  }

  React.useEffect(() => {
    if (credentials) {
      setFormValues(credentials)
    }
  }, [])

  function resolveFieldHandler(field: AcceptedCredentialField) {
    return (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault()
      setFormValues({
        ...formValues,
        [field.name]: e.currentTarget.value,
      })
    }
  }

  return (
    <Card padding={4} border>
      <Stack space={3}>
        {credentials ? (
          <>
            <Heading size={3}>Edit settings</Heading>
            <Text size={2}>
              Be careful when editing these changes as they can be destructive.
            </Text>
          </>
        ) : (
          <>
            <Label size={2} muted>
              External media library
            </Label>
            <Heading size={3}>First time set-up</Heading>
            <Text size={2}>
              In order to communicate with external vendor to upload videos &
              audio, you’ll have to set-up credentials below:
            </Text>
          </>
        )}
        {props.vendorConfig.credentialsFields?.length ? (
          <form style={{ marginTop: '1.5rem' }} onSubmit={submitCredentials}>
            <Stack space={4}>
              {props.vendorConfig.credentialsFields.map((field) => (
                <DefaultFormField label={field.title || field.name} level={0}>
                  <TextInput
                    icon={field.icon}
                    onInput={resolveFieldHandler(field)}
                    value={formValues[field.name] || ''}
                    type={field.type === 'number' ? 'number' : 'text'}
                    disabled={isLoading}
                  />
                </DefaultFormField>
              ))}
              <Button
                text={
                  credentials?.apiKey
                    ? 'Update credentials'
                    : 'Set-up credentials'
                }
                icon={UploadIcon}
                iconRight={isLoading && Spinner}
                tone="positive"
                fontSize={2}
                padding={3}
                type="submit"
                disabled={isLoading}
              />
            </Stack>
          </form>
        ) : (
          <>
            <Heading size={3}>Plugin configured incorrectly</Heading>
            <Text size={3}>
              Missing the credentialsField configuration property
            </Text>
          </>
        )}
      </Stack>
    </Card>
  )
}

export default ConfigureCredentials
