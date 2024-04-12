import { BaseEntity, BeforeInsert, BeforeUpdate, Column } from 'typeorm';

export abstract class Base extends BaseEntity {
    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @BeforeInsert()
    updateTimestampsOnInsert() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @BeforeUpdate()
    updateTimestampsOnUpdate() {
        this.updatedAt = new Date();
    }
}
