import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), '../.env'),
});

export const ENV_VAR = process.env;
