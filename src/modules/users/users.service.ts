import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
    constructor() {}

    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme'
        },
        {
            userId: 2,
            username: 'maria',
            password: 'guess'
        },
        {
            userId: 3,
            username: 'Tuan',
            password: '123'
        }
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find((user) => user.username === username);
    }
}
