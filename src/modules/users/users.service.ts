import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

export type User = any;

@Injectable()
export class UsersService {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async findOne(username: string): Promise<User | undefined> {
        return await this.dataSource.query(`SELECT * FROM public.Account WHERE username=${username}`);
    }
}
