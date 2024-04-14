import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity('account')
export class Account extends Base {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    provider_username: string;

    @Column()
    provider: string;

    @Column()
    provider_id: string;

    @Column({
        nullable: true
    })
    username: string;

    @Column({
        nullable: true
    })
    email: string;

    @Column({
        nullable: true
    })
    gender: string;
}
