import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const moderation = async (task) => {
    const { results } = await openai.moderations.create({
        input: task.input,
        model: 'text-moderation-latest'
    })

    console.log(results)

    return results.map(result => result.flagged ? 1 : 0)
}
