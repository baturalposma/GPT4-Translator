// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

export const fillKeys = async ({
  inputLanguage,
  object,
  openai,
  outputLanguage,
}: {
  object: Record<string, string>
  inputLanguage: string
  outputLanguage: string
  openai: OpenAIApi
}) => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        content:
          'You are a bot that fills in the blanks of a locales JSON. The user provides you a JSON with a field named "keyLanguage", which defines the language the keys of the JSON are defined in. It also has a field named "outputLanguage", which defines the language you should translate the keys to. The last field is named "keys", which includes the object with the keys to translate. If a key already has a value, just leave it like this, otherwise fill the empty string with a translation, which best fits the key. I give you an example input: {"keyLanguage": "English", outputLanguage: "German", "keys": {"hello": "", "world": ""}}. The output should be {"hello": "Hallo", "world": "Welt"}.',
        role: 'system',
      },
      {
        content: JSON.stringify({
          keyLanguage: inputLanguage,
          outputLanguage,
          keys: object,
        }),
        role: 'user',
      },
    ],
  })

  return completion.data.choices[0].message.content
}

export const translateKey = async ({
  inputLanguage,
  object,
  openai,
  outputLanguage,
}: {
  object: Record<string, string>
  inputLanguage: string
  outputLanguage: string
  openai: OpenAIApi
}) => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        content:
          `Translate the following English text to ${outputLanguage}`,
        role: 'system',
      },
      {
        content: JSON.stringify({
          inputLanguage,
          outputLanguage,
          data: object,
        }),
        role: 'user',
      },
    ],
  })

  return completion.data.choices[0].message.content
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body.text || !req.body.inputLanguage || !req.body.outputLanguage || !req.body.mode) {
    res.status(400).json({ error: 'Lütfen gerekli tüm parametreleri sağlayın' })
    return
  }

  if (!Boolean(process.env.OPENAI_KEY) && !req.body.key) {
    res.status(400).json({ error: 'Lütfen bir OpenAI API anahtarı sağlayın' })
    return
  }

  const configuration = new Configuration({
    apiKey: req.body.key ? req.body.key : process.env.OPENAI_KEY,
  })

  const openai = new OpenAIApi(configuration)

  let data
  try {
    data = JSON.parse(req.body.text)
  } catch (error) {
    res.status(400).json({ error: 'Geçersiz JSON formatı' })
    return
  }

  const formattedData = JSON.stringify(data)

  let result
  try {
    if (req.body.mode === 'fillEmpty') {
      result = await fillKeys({
        object: formattedData,
        inputLanguage: req.body.inputLanguage as string,
        outputLanguage: req.body.outputLanguage as string,
        openai,
      })
    } else {
      result = await translateKey({
        object: formattedData,
        inputLanguage: req.body.inputLanguage as string,
        outputLanguage: req.body.outputLanguage as string,
        openai,
      })
    }
  } catch (error) {
    res.send({
      success: false,
      error: 'İstek işlenemedi. API anahtarı geçersiz olabilir.',
    })
    return
  }

  res.send({
    success: true,
    data: result,
  })
}