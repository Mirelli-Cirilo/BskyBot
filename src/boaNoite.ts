import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import axios from 'axios';

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
});

async function getRandomQuote(): Promise<string>{

    try {
        const response = await axios.get('https://recite.onrender.com/api/v1/random');
        const { quote, book, author } = response.data;
        return `"${quote}" - ${author}, ${book}`; 
    } catch (error) {
        console.error('Erro ao obter citação:', error);
        return 'Erro ao obter citação'; 
    }
}

async function main() {
    await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD! });

    const quote = await getRandomQuote();

    await agent.post({     
        text: quote
    });
    console.log("Just posted!");
}

// Run this on a cron job
const scheduleExpressionMinute = '*/2 * * * *'; // Run once every minute for testing


const scheduleExpression = '0 13 * * *'; // Executa todos os dias às 13h

const job = new CronJob(scheduleExpression, main, null, true, 'America/Sao_Paulo');

job.start();