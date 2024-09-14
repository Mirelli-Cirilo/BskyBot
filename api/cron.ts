import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';

dotenv.config();

// Crie um agente Bluesky
const agent = new BskyAgent({
    service: 'https://bsky.social',
});

async function getRandomQuote(): Promise<string> {
    try {
        const response = await axios.get('https://recite.onrender.com/api/v1/random');
        const { quote, book, author } = response.data;
        return `"${quote}" - ${author}, ${book}`;
    } catch (error) {
        console.error('Erro ao obter citação:', error);
        return 'Erro ao obter citação';
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log('Iniciando processo de login...');
        await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD! });
        console.log('Login realizado com sucesso.');

        const quote = await getRandomQuote();
        await agent.post({ text: quote });

        res.status(200).send('Postagem realizada com sucesso!');
    } catch (error) {
        console.error('Erro ao executar cron job:', error);
        res.status(500).send('Erro ao executar cron job');
    }
}