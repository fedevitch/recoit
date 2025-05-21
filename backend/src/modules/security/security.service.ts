import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PASSWORD_SALT_DELIMITER } from 'src/constants';

@Injectable()
export class SecurityService {
    public createPasswordHash(password: string): string {
        const hash = createHash('sha512');
        hash.update(password);
        const salt = randomBytes(128).toString('hex');
        hash.update(salt);
        const hashedPassword = hash.digest('hex');

        return `${hashedPassword}${PASSWORD_SALT_DELIMITER}${salt}`;
    }

    public isPasswordCorrect(password: string, dbPasswordData: string): boolean {
        const [dbHashedPassword, salt] = dbPasswordData.split(PASSWORD_SALT_DELIMITER);
        const hash = createHash('sha512');
        hash.update(password);
        hash.update(salt);
        const hashedPassword = hash.digest('hex');

        return hashedPassword === dbHashedPassword;
    }
}
