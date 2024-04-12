import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Account extends Base {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    providerUsername: string;

    @Column()
    provider: string;

    @Column()
    providerId: string;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column()
    gender: string;
}
